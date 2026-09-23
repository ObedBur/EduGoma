import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EmailService } from '../tenant/services/email.service';
import { WhatsAppService } from '../tenant/services/whatsapp.service';
import { AlertService } from '../alert/alert.service';
import { env } from '../../config/env';

type Channel = 'email' | 'whatsapp' | 'alert' | 'system';
type Step = 'j1_guide' | 'j3_login_reminder' | 'j7_import' | 'j14_no_students' | 'j27_trial' | 'j30_suspend';

interface TenantContext {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  validatedAt: Date;
  day: number;
}

/**
 * Cron onboarding J+0…J+30 (#51).
 * Toutes les heures : pour chaque école active, envoie les steps non encore logués.
 * J+0 est géré dans validate() — ici on démarre à J+1.
 */
@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);
  private running = false;

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private whatsappService: WhatsAppService,
    private alertService: AlertService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron(): Promise<void> {
    await this.runOnce();
  }

  async runOnce(): Promise<{ processed: number; sent: number }> {
    if (this.running) {
      this.logger.debug('Scheduler already running - skip');
      return { processed: 0, sent: 0 };
    }

    this.running = true;
    let processed = 0;
    let sent = 0;

    try {
      const tenants = await this.prisma.tenant.findMany({
        where: { status: 'active', validatedAt: { not: null } },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          validatedAt: true,
        },
      });

      for (const t of tenants) {
        const day = this.daySince(t.validatedAt);
        if (day < 1 || day > 30) continue;

        const ctx: TenantContext = {
          id: t.id,
          name: t.name,
          phone: t.phone,
          email: t.email,
          validatedAt: t.validatedAt!,
          day,
        };

        processed++;
        const n = await this.processTenant(ctx);
        sent += n;
      }

      this.logger.log(`Onboarding cron: ${processed} tenant(s), ${sent} message(s)`);
    } catch (error) {
      this.logger.error(`Onboarding cron failed: ${error.message}`);
    } finally {
      this.running = false;
    }

    return { processed, sent };
  }

  private async processTenant(ctx: TenantContext): Promise<number> {
    let sent = 0;

    if (ctx.day >= 1) {
      sent += (await this.runStep(ctx, 'j1_guide', 'email', () => this.sendGuideEmail(ctx))) ? 1 : 0;
    }

    if (ctx.day >= 3) {
      const loggedIn = await this.hasSuccessfulLoginSince(ctx);
      if (!loggedIn) {
        sent += (await this.runStep(ctx, 'j3_login_reminder', 'whatsapp', () =>
          this.sendLoginReminder(ctx),
        ))
          ? 1
          : 0;
      }
    }

    if (ctx.day >= 7) {
      sent += (await this.runStep(ctx, 'j7_import', 'email', () => this.sendImportEmail(ctx))) ? 1 : 0;
    }

    if (ctx.day >= 14) {
      const hasStudents = await this.hasStudents(ctx);
      if (!hasStudents) {
        sent += (await this.runStep(ctx, 'j14_no_students', 'alert', () =>
          this.createNoStudentsAlert(ctx),
        ))
          ? 1
          : 0;
      }
    }

    if (ctx.day >= 27) {
      sent += (await this.runStep(ctx, 'j27_trial', 'email', () => this.sendTrialEmail(ctx))) ? 1 : 0;
      sent += (await this.runStep(ctx, 'j27_trial', 'whatsapp', () => this.sendTrialWhatsApp(ctx)))
        ? 1
        : 0;
    }

    if (ctx.day >= 30) {
      // #43 : suspendre si pas d'abonnement payé ; log anti-doublon
      sent += (await this.runStep(ctx, 'j30_suspend', 'system', () =>
        this.handleJ30Suspend(ctx),
      ))
        ? 1
        : 0;
    }

    return sent;
  }

  /**
   * J+30 : si pas de paiement du mois → suspendre l'école (#43).
   * Si payé → ne rien faire (success pour ne pas relancer).
   */
  private async handleJ30Suspend(ctx: TenantContext): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: ctx.id },
      select: { status: true, subscriptionStatus: true, subscriptionPaidAt: true },
    });

    if (!tenant || tenant.status !== 'active') {
      // Déjà suspendu / inactif : on marque le step comme fait
      return true;
    }

    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const payment = await this.prisma.payment.findUnique({
      where: { tenantId_period: { tenantId: ctx.id, period } },
    });

    const paidRecently =
      tenant.subscriptionPaidAt &&
      now.getTime() - tenant.subscriptionPaidAt.getTime() <= 30 * 24 * 60 * 60 * 1000;

    if (payment || paidRecently) {
      this.logger.log(`[j30] ${ctx.name} has active subscription - no suspend`);
      return true;
    }

    await this.prisma.tenant.update({
      where: { id: ctx.id },
      data: {
        status: 'suspended',
        subscriptionStatus: 'overdue',
      },
    });

    await this.prisma.tenantLog.create({
      data: {
        tenantId: ctx.id,
        action: 'suspended',
        metadata: JSON.stringify({
          reason: 'trial_expired_no_subscription',
          day: 30,
          auto: true,
        }),
      },
    });

    this.logger.warn(`[j30] Suspended ${ctx.name} - no subscription after trial`);
    return true;
  }

  /**
   * Anti-doublon : skip si success=true déjà loggé.
   * Sinon exécute, puis upsert success / errorMsg.
   * Un échec reste relançable à la prochaine heure.
   */
  private async runStep(
    ctx: TenantContext,
    step: Step,
    channel: Channel,
    action: () => Promise<boolean>,
  ): Promise<boolean> {
    const existing = await this.prisma.notificationLog.findUnique({
      where: {
        tenantId_step_channel: {
          tenantId: ctx.id,
          step,
          channel,
        },
      },
    });

    if (existing?.success) {
      return false;
    }

    let success = false;
    let errorMsg: string | null = null;

    try {
      success = await action();
      if (!success) {
        errorMsg = 'send_failed';
      }
    } catch (error) {
      success = false;
      errorMsg = error.message?.slice(0, 500) ?? 'unknown_error';
    }

    if (success) {
      await this.prisma.notificationLog.upsert({
        where: {
          tenantId_step_channel: {
            tenantId: ctx.id,
            step,
            channel,
          },
        },
        create: {
          tenantId: ctx.id,
          step,
          channel,
          success: true,
        },
        update: {
          success: true,
          errorMsg: null,
          sentAt: new Date(),
        },
      });
    } else if (existing) {
      await this.prisma.notificationLog.update({
        where: { id: existing.id },
        data: { success: false, errorMsg },
      });
    } else {
      await this.prisma.notificationLog.create({
        data: {
          tenantId: ctx.id,
          step,
          channel,
          success: false,
          errorMsg,
        },
      });
    }

    if (success) {
      this.logger.log(`[${step}/${channel}] sent to ${ctx.name}`);
    } else {
      this.logger.warn(`[${step}/${channel}] failed for ${ctx.name}: ${errorMsg}`);
    }

    return success;
  }

  private async hasSuccessfulLoginSince(ctx: TenantContext): Promise<boolean> {
    const count = await this.prisma.loginAttempt.count({
      where: {
        success: true,
        createdAt: { gte: ctx.validatedAt },
        user: { tenantId: ctx.id },
      },
    });
    return count > 0;
  }

  private async hasStudents(ctx: TenantContext): Promise<boolean> {
    // Pas de modèle Student : on considère tout User hors admin plateforme comme activité.
    // En dev/seed, un compte admin école compte comme "premier usage".
    const count = await this.prisma.user.count({
      where: { tenantId: ctx.id },
    });
    return count > 0;
  }

  private async sendGuideEmail(ctx: TenantContext): Promise<boolean> {
    if (!ctx.email) return false;
    const loginUrl = `${env.CLIENT_URL}/login`;
    const html = this.baseHtml(
      'Guide de démarrage EduGoma',
      `<p>Bonjour,</p>
       <p>Bienvenue&nbsp! Voici les premiers pas pour <strong>${this.esc(ctx.name)}</strong>&nbsp:</p>
       <ol>
         <li>Connectez-vous avec l'identifiant <strong>${this.esc(ctx.phone)}</strong></li>
         <li>Complétez le profil de l'établissement</li>
         <li>Invitez vos enseignants</li>
         <li>Importez votre première liste d'élèves</li>
       </ol>
       <p><a href="${loginUrl}" style="background:#102d48;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">Accéder à mon espace</a></p>`,
    );
    return this.emailService.sendRawEmail(
      ctx.email,
      `Guide de démarrage — ${ctx.name}`,
      html,
    );
  }

  private async sendLoginReminder(ctx: TenantContext): Promise<boolean> {
    const loginUrl = `${env.CLIENT_URL}/login`;
    const message = `Bonjour 👋

Vous n'avez pas encore connecté l'espace *${ctx.name}* sur EduGoma.

🔗 ${loginUrl}
📱 Identifiant : ${ctx.phone}

Une question ? Répondez à ce message.`;

    return this.whatsappService.sendRawMessage(ctx.phone, message);
  }

  private async sendImportEmail(ctx: TenantContext): Promise<boolean> {
    if (!ctx.email) return false;
    const html = this.baseHtml(
      'Importer vos élèves sur EduGoma',
      `<p>Bonjour,</p>
       <p>Pour <strong>${this.esc(ctx.name)}</strong> : comment importer vos élèves&nbsp:</p>
       <ol>
         <li>Espace → <strong>Élèves</strong> → <strong>Importer</strong></li>
         <li>Préparez un fichier CSV (nom, classe, téléphone parent)</li>
         <li>Vérifiez l'aperçu puis confirmez</li>
       </ol>
       <p>Besoin d'aide ? Contactez le support EduGoma.</p>`,
    );
    return this.emailService.sendRawEmail(
      ctx.email,
      `Importer vos élèves — ${ctx.name}`,
      html,
    );
  }

  private async createNoStudentsAlert(ctx: TenantContext): Promise<boolean> {
    await this.alertService.createAlert({
      tenantId: ctx.id,
      type: 'USAGE',
      severity: 'warning',
      title: 'École sans élèves importés',
      message: `${ctx.name} est active depuis ${ctx.day} jours sans élèves importés.`,
      source: 'notifications',
    });
    return true;
  }

  private async sendTrialEmail(ctx: TenantContext): Promise<boolean> {
    if (!ctx.email) return false;
    const html = this.baseHtml(
      'Votre essai se termine dans 3 jours',
      `<p>Bonjour,</p>
       <p>L'essai gratuit de <strong>${this.esc(ctx.name)}</strong> se termine dans <strong>3 jours</strong>.</p>
       <p>Contactez l'équipe EduGoma pour souscrire une licence et garder l'accès complet.</p>`,
    );
    return this.emailService.sendRawEmail(
      ctx.email,
      `Essai EduGoma — se termine bientôt (${ctx.name})`,
      html,
    );
  }

  private async sendTrialWhatsApp(ctx: TenantContext): Promise<boolean> {
    const message = `Bonjour ⏳

L'essai gratuit de *${ctx.name}* se termine dans 3 jours.

Contactez EduGoma pour activer votre licence et continuer sans interruption.

Merci de votre confiance !`;
    return this.whatsappService.sendRawMessage(ctx.phone, message);
  }

  private daySince(date: Date): number {
    const ms = Date.now() - date.getTime();
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }

  private esc(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private baseHtml(title: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;">
    <tr><td style="background:linear-gradient(135deg,#102d48,#184269);padding:24px;color:#fff;">
      <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#a9ddcf;">EduGoma</p>
      <h1 style="margin:6px 0 0;font-size:20px;">${title}</h1>
    </td></tr>
    <tr><td style="padding:24px;font-size:14px;line-height:1.6;color:#334155;">${body}</td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;">
      Email automatique EduGoma — onboarding
    </td></tr>
  </table>
</body></html>`;
  }
}
