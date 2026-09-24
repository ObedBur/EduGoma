import { BrevoClient } from '@getbrevo/brevo';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { env } from '../../../config/env';

export interface WelcomeEmailPayload {
  schoolName: string;
  phone: string;
  email: string;
  commune?: string | null;
  /** Lien de création de mot de passe (remplace le login direct) */
  setupUrl?: string;
  /** Durée de validité du lien en minutes (affichage) */
  setupTtlMinutes?: number;
}

/**
 * Email d'activation envoyé après validation d'une école (#49).
 * Brevo en production ; log console en dev si non configuré.
 * Ne doit jamais faire échouer la validation.
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private brevoClient: BrevoClient | null = null;
  private brevoEnabled = false;

  async onModuleInit(): Promise<void> {
    this.initializeBrevo();
  }

  private initializeBrevo(): void {
    if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) {
      this.logger.warn('Brevo not configured - welcome emails will be logged only');
      this.brevoEnabled = false;
      return;
    }

    try {
      this.brevoClient = new BrevoClient({ apiKey: env.BREVO_API_KEY });
      this.brevoEnabled = true;
      this.logger.log('Brevo welcome-email service initialized');
    } catch (error) {
      this.logger.error(`Failed to initialize Brevo: ${error.message}`);
      this.brevoEnabled = false;
    }
  }

  async sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<boolean> {
    if (!payload.email) {
      this.logger.warn(`No email for school "${payload.schoolName}" - welcome email skipped`);
      return false;
    }

    const subject = `Activation de votre compte EduGoma — ${payload.schoolName}`;
    const htmlContent = this.buildWelcomeHtml(payload);

    return this.sendRawEmail(payload.email, subject, htmlContent);
  }

  async sendRawEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    if (!to) {
      this.logger.warn('sendRawEmail: no recipient - skipped');
      return false;
    }

    if (!this.brevoEnabled || !this.brevoClient) {
      this.logger.log(`[EMAIL MOCK] To: ${to}\n` + `[EMAIL MOCK] Subject: ${subject}`);
      return true;
    }

    try {
      await this.brevoClient.transactionalEmails.sendTransacEmail({
        subject,
        htmlContent,
        sender: {
          email: env.BREVO_SENDER_EMAIL,
          name: 'EduGoma',
        },
        to: [{ email: to }],
      });

      this.logger.log(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }

  private buildWelcomeHtml(payload: WelcomeEmailPayload): string {
    const loginUrl = `${env.CLIENT_URL}/login`;
    const setupUrl = payload.setupUrl || loginUrl;
    const ttl = payload.setupTtlMinutes ?? Math.round(env.SETUP_LINK_TTL_SECONDS / 60);
    const communeLine = payload.commune
      ? `<p style="margin:4px 0;color:#55697a;font-size:13px;">Commune : <strong>${this.escape(payload.commune)}</strong></p>`
      : '';

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#102d48 0%,#184269 100%);padding:28px 28px 24px;color:#ffffff;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a9ddcf;">EduGoma</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;font-weight:800;">Votre école est validée&nbsp;!</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#c0d4e7;">Bienvenue dans l'écosystème scolaire du Nord-Kivu.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">
                Félicitations&nbsp;! L'établissement <strong>${this.escape(payload.schoolName)}</strong> a été validé sur la plateforme EduGoma. Votre espace est maintenant actif (essai gratuit initialisé).
              </p>

              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:0 0 20px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">Créez votre mot de passe</p>
                <p style="margin:4px 0;font-size:13px;color:#334155;">Ouvrez le lien sécurisé ci-dessous pour choisir votre mot de passe (valable <strong>${ttl} minutes</strong>).</p>
                ${communeLine}
                <p style="margin:4px 0;font-size:13px;color:#334155;">Lien&nbsp;: <a href="${this.escape(setupUrl)}" style="color:#2b6cb0;font-weight:600;word-break:break-all;">${this.escape(setupUrl)}</a></p>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 20px;">
                    <a href="${this.escape(setupUrl)}"
                      style="display:inline-block;background:#102d48;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;">
                      Créer mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;line-height:1.6;color:#55697a;">
                Ce lien est à usage unique. Pour toute assistance, répondez à cet email ou contactez l'équipe EduGoma.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                Email automatique envoyé par EduGoma après la validation de votre établissement.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
