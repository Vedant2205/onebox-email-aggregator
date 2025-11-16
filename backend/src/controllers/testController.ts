import { Request, Response } from 'express';
import { NotificationService } from '../notifications/notificationService';
import { ElasticService } from '../elastic/elasticService';

export class TestController {
  constructor(
    private notificationService: NotificationService,
    private elasticService: ElasticService
  ) {}

  testSlack = async (req: Request, res: Response): Promise<void> => {
    try {
      const testEmail: any = {
        id: 'test-email-id',
        subject: 'Test Email Subject',
        from: 'test@example.com',
        date: new Date().toISOString(),
      };

      await this.notificationService.notifySlack(testEmail);
      res.json({ message: 'Slack notification sent successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  testWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const testEmail: any = {
        id: 'test-email-id',
        subject: 'Test Email Subject',
        from: 'test@example.com',
        date: new Date().toISOString(),
      };

      await this.notificationService.notifyWebhook(testEmail, 'Interested');
      res.json({ message: 'Webhook notification sent successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}









