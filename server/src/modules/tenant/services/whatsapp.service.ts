import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../../config/env';

export interface WelcomeWhatsAppPayload {
  schoolName: string;
  phone: string;
}

/**
 * WhatsApp d'accueil après validation (#48).
 * Sans WHATSAPP_API_TOKEN : log console (dev).
 * Avec Meta Cloud API : envoi automatique.
 * Ne doit jamais faire échouer la validation.
 */
@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  async sendWelcomeMessage(payload: WelcomeWhatsAppPayload): Promise<boolean> {
    const message = this.buildWelcomeMessage(payload);
    return this.sendRawMessage(payload.phone, message);
  }

  async sendRawMessage(phone: string, message: string): Promise<boolean> {
    const to = this.normalizePhone(phone);

    if (!to) {
      this.logger.warn('sendRawMessage: no phone - WhatsApp skipped');
      return false;
    }

    if (!env.WHATSAPP_API_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
      this.logger.log(
        `[WHATSAPP MOCK] To: ${to}\n` +
          `[WHATSAPP MOCK] Message:\n${message}`,
      );
      return true;
    }

    return this.sendViaMetaCloud(to, message);
  }

  private async sendViaMetaCloud(to: string, message: string): Promise<boolean> {
    const version = env.WHATSAPP_API_VERSION || 'v21.0';
    const url = `https://graph.facebook.com/${version}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { preview_url: false, body: message },
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.error(`WhatsApp Meta Cloud error ${res.status}: ${body}`);
        return false;
      }

      this.logger.log(`Welcome WhatsApp sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp to ${to}: ${error.message}`);
      return false;
    }
  }

  private buildWelcomeMessage(payload: WelcomeWhatsAppPayload): string {
    const accessUrl = `${env.CLIENT_URL}/login`;

    return `Bonjour ! 🎉

Votre établissement *${payload.schoolName}* a été validé avec succès sur la plateforme EduGoma.

🔗 Accès à votre espace : ${accessUrl}
📱 Identifiant de connexion : ${payload.phone}

Bienvenue dans l'écosystème scolaire connecté du Nord-Kivu !
Pour toute assistance, répondez directement à ce message.`;
  }

  private normalizePhone(phone: string): string {
    if (!phone) return '';

    let digits = phone.replace(/[^\d+]/g, '');
    if (digits.startsWith('+')) {
      digits = digits.slice(1);
    }
    if (digits.startsWith('0')) {
      digits = `243${digits.slice(1)}`;
    }
    if (!digits.startsWith('243')) {
      digits = `243${digits}`;
    }
    return digits;
  }
}
