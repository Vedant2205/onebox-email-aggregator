import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { EmailDocument } from '../elastic/elasticService';

export class NotificationService {
  async notifySlack(email: EmailDocument): Promise<void> {
    if (!config.notifications.slackWebhookUrl) {
      logger.debug('Slack webhook URL not configured, skipping notification');
      return;
    }

    try {
      const message = {
        text: `New Interested lead: ${email.subject} from ${email.from}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*New Interested Lead*\n*Subject:* ${email.subject}\n*From:* ${email.from}\n*Date:* ${new Date(email.date).toLocaleString()}`,
            },
          },
        ],
      };

      await axios.post(config.notifications.slackWebhookUrl, message);
      logger.info(`Slack notification sent for email: ${email.id}`);
    } catch (error) {
      logger.error('Error sending Slack notification:', error);
    }
  }

  async notifyWebhook(email: EmailDocument, label: string): Promise<void> {
    if (!config.notifications.webhookSiteUrl) {
      logger.debug('Webhook site URL not configured, skipping notification');
      return;
    }

    try {
      const payload = {
        emailId: email.id,
        subject: email.subject,
        from: email.from,
        label,
        date: email.date,
      };

      await axios.post(config.notifications.webhookSiteUrl, payload);
      logger.info(`Webhook notification sent for email: ${email.id}`);
    } catch (error) {
      logger.error('Error sending webhook notification:', error);
    }
  }

  async handleInterestedEmail(email: EmailDocument): Promise<void> {
    await Promise.all([
      this.notifySlack(email),
      this.notifyWebhook(email, 'Interested'),
    ]);
  }
}









