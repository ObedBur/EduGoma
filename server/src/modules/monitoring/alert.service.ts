import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';
import { env } from '../../config/env';

export interface AlertPayload {
  type: 'BRUTE_FORCE' | 'CREDENTIAL_STUFFING' | 'ACCOUNT_TARGETED' | 'ANOMALOUS_SUCCESS';
  tenantId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class AlertService implements OnModuleInit {
  private readonly logger = new Logger(AlertService.name);
  private alertCounts = new Map<string, { count: number; firstAlert: Date }>();
  private brevoClient: BrevoClient | null = null;
  private brevoEnabled = false;
  private brevoEnabled = false;

  async onModuleInit(): Promise<void> {
    this.initializeBrevo();
  }

  private brevoClient: BrevoClient | null = null;

  private initializeBrevo(): void {
    if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) {
      this.logger.warn('Brevo not configured - email alerts will be logged only');
      this.brevoEnabled = false;
      return;
    }

    try {
      this.brevoClient = new BrevoClient({ apiKey: env.BREVO_API_KEY });
      this.brevoEnabled = true;
      this.logger.log('Brevo email service initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize Brevo: ${error.message}`);
      this.brevoEnabled = false;
    }
  }

  /**
   * Send alert via configured channels
   */
  async sendAlert(payload: AlertPayload): Promise<void> {
    // Deduplication: avoid spamming same alert
    const dedupKey = `${payload.type}:${payload.tenantId}:${payload.metadata.userId || 'unknown'}`;
    const existing = this.alertCounts.get(dedupKey);
    const now = new Date();

    if (existing && now.getTime() - existing.firstAlert.getTime() < 15 * 60 * 1000) {
      // Within 15 minutes, just increment count
      existing.count++;
      this.logger.debug(`Alert deduplicated: ${dedupKey} (count: ${existing.count})`);
      return;
    }

    // New alert window
    this.alertCounts.set(dedupKey, { count: 1, firstAlert: now });

    // Log always (structured for log aggregation)
    this.logger.warn({
      alert: true,
      ...payload,
      deduplicationKey: dedupKey,
    });

    // Send via configured channels
    await this.sendEmail(payload);
    await this.sendWebhook(payload);
  }

  /**
   * Send email alert via Brevo
   */
  private async sendEmail(payload: AlertPayload): Promise<void> {
    const emailRecipients = env.ALERT_EMAIL_RECIPIENTS?.split(',').map(e => e.trim()).filter(Boolean) || [];
    
    if (emailRecipients.length === 0) {
      this.logger.debug('No email recipients configured for alerts');
      return;
    }

    if (!this.brevoEnabled || !this.brevoClient) {
      this.logger.warn('Brevo not available - email alert logged only');
      this.logger.log(`[EMAIL ALERT] Would send to: ${emailRecipients.join(', ')}`);
      this.logger.log(`[EMAIL ALERT] Subject: [EduGoma Security] ${payload.severity} - ${payload.type}`);
      return;
    }

    try {
      const email = {
        subject: `[EduGoma Security] ${payload.severity} - ${payload.type}`,
        htmlContent: this.generateEmailHtml(payload),
        sender: {
          email: env.BREVO_SENDER_EMAIL,
          name: env.BREVO_SENDER_NAME,
        },
        to: emailRecipients.map(email => ({ email })),
      };

      await this.brevoClient.transactionalEmails.sendTransacEmail(email);
      
      this.logger.log(`Security alert email sent via Brevo to ${emailRecipients.length} recipient(s): ${payload.type}`);
    } catch (error) {
      this.logger.error(`Failed to send email via Brevo: ${error.message}`);
      // Don't throw - alerting should not break the main flow
    }
  }

  /**
   * Send webhook alert (for Slack, Discord, PagerDuty, etc.)
   */
  private async sendWebhook(payload: AlertPayload): Promise<void> {
    const webhookUrl = env.ALERT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      this.logger.debug('No webhook URL configured for alerts');
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formatWebhookPayload(payload)),
      });
      
      this.logger.log(`Webhook alert sent to ${webhookUrl}: ${payload.type}`);
    } catch (error) {
      this.logger.error(`Failed to send webhook alert: ${error.message}`);
    }
  }

  /**
   * Format payload for Slack/Discord webhook
   */
  private formatWebhookPayload(payload: AlertPayload): any {
    const colorMap = {
      LOW: '#36a64f',
      MEDIUM: '#ff9900',
      HIGH: '#ff0000',
      CRITICAL: '#8B0000',
    };

    return {
      embeds: [{
        title: `🚨 EduGoma Security Alert: ${payload.type}`,
        color: parseInt(colorMap[payload.severity].replace('#', ''), 16),
        fields: [
          { name: 'Tenant', value: payload.tenantId, inline: true },
          { name: 'Severity', value: payload.severity, inline: true },
          { name: 'Time', value: payload.timestamp.toISOString(), inline: true },
          { name: 'Details', value: payload.message },
        ],
        timestamp: payload.timestamp.toISOString(),
      }],
    };
  }

  /**
   * Generate HTML email template
   */
  private generateEmailHtml(payload: AlertPayload): string {
    const severityColors = {
      LOW: '#28a745',
      MEDIUM: '#ffc107',
      HIGH: '#fd7e14',
      CRITICAL: '#dc3545',
    };

    const color = severityColors[payload.severity] || '#6c757d';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚨 EduGoma Security Alert</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">${payload.severity} • ${payload.type}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef; border-top: none;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; width: 120px;">Tenant</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${payload.tenantId}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Severity</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">
                <span style="background: ${color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${payload.severity}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef; font-weight: 600;">Time (UTC)</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e9ecef;">${payload.timestamp.toISOString()}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 600; vertical-align: top;">Details</td>
              <td style="padding: 12px 0;">${payload.message}</td>
            </tr>
          </table>

          ${Object.keys(payload.metadata).length > 0 ? `
            <div style="margin-top: 24px; padding: 16px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
              <h3 style="margin: 0 0 12px; font-size: 14px; color: #6c757d;">Metadata</h3>
              <pre style="margin: 0; padding: 12px; background: #f8f9fa; border-radius: 4px; font-size: 12px; overflow-x: auto; white-space: pre-wrap;">${JSON.stringify(payload.metadata, null, 2)}</pre>
            </div>
          ` : ''}
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e9ecef; text-align: center; color: #6c757d; font-size: 12px;">
            <p style="margin: 0;">Cet email a été envoyé automatiquement par le système de monitoring EduGoma.</p>
            <p style="margin: 8px 0 0;">${new Date().toLocaleString('fr-FR', { timeZone: 'UTC' })} UTC</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}