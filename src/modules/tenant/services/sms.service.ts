import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../../config/env';

/**
 * SMS Service - Mock implementation for development
 * Production: Integrate with Africa's Talking API
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  /**
   * Generate a 6-digit verification code
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification code via SMS
   * @param phone - RDC phone number (+243...)
   * @param code - 6-digit code
   */
  async sendVerificationCode(phone: string, code: string): Promise<boolean> {
    try {
      // DEVELOPMENT MODE: Log to console
      if (env.NODE_ENV !== 'production') {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 SMS VERIFICATION CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${phone}
Code: ${code}
Message: Votre code de vérification Education Goma est: ${code}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return true;
      }

      // PRODUCTION MODE: Use Africa's Talking
      // Uncomment and configure when ready for production:
      /*
      const AfricasTalking = require('africastalking')({
        apiKey: env.SMS_API_KEY,
        username: env.SMS_USERNAME
      });

      const sms = AfricasTalking.SMS;
      const result = await sms.send({
        to: [phone],
        message: `Votre code de verification Education Goma est: ${code}`,
        from: env.SMS_SENDER_ID
      });

      this.logger.log(`SMS sent to ${phone}: ${JSON.stringify(result)}`);
      return result.SMSMessageData.Recipients[0].status === 'Success';
      */

      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phone}:`, error);
      return false;
    }
  }

  /**
   * Send welcome notification after validation
   */
  async sendWelcomeMessage(phone: string, schoolName: string): Promise<boolean> {
    try {
      if (env.NODE_ENV !== 'production') {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 WELCOME SMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${phone}
Message: Félicitations ${schoolName}! Votre école a été validée sur Education Goma. 
Connectez-vous sur: https://educationgoma.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return true;
      }

      // Production SMS sending would go here
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome SMS to ${phone}:`, error);
      return false;
    }
  }

  /**
   * Send rejection notification
   */
  async sendRejectionMessage(
    phone: string, 
    schoolName: string, 
    reason: string
  ): Promise<boolean> {
    try {
      if (env.NODE_ENV !== 'production') {
        this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ REJECTION SMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${phone}
Message: ${schoolName}, votre demande d'inscription sur Education Goma n'a pas été acceptée.
Raison: ${reason}
Contact support: +243...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        return true;
      }

      // Production SMS sending would go here
      return true;
    } catch (error) {
      this.logger.error(`Failed to send rejection SMS to ${phone}:`, error);
      return false;
    }
  }
}
