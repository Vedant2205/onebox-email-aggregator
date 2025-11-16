import { Request, Response } from 'express';
import { ElasticService } from '../elastic/elasticService';
import { ClassificationService } from '../classification/classificationService';
import { NotificationService } from '../notifications/notificationService';

export class EmailController {
  constructor(
    private elasticService: ElasticService,
    private classificationService: ClassificationService,
    private notificationService: NotificationService
  ) {}

  searchEmails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q, account, folder, fromDate, toDate, page, size } = req.query;

      const result = await this.elasticService.searchEmails({
        q: q as string,
        account: account as string,
        folder: folder as string,
        fromDate: fromDate as string,
        toDate: toDate as string,
        page: page ? parseInt(page as string, 10) : 1,
        size: size ? parseInt(size as string, 10) : 20,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getEmailById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const email = await this.elasticService.getEmailById(id);

      if (!email) {
        res.status(404).json({ error: 'Email not found' });
        return;
      }

      res.json(email);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  classifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const email = await this.elasticService.getEmailById(id);

      if (!email) {
        res.status(404).json({ error: 'Email not found' });
        return;
      }

      const label = await this.classificationService.classifyEmail(
        email.subject,
        email.text,
        email.from
      );

      await this.elasticService.updateEmailLabels(id, [label]);

      // If interested, send notifications
      if (label === 'Interested') {
        await this.notificationService.handleInterestedEmail(email);
      }

      res.json({ emailId: id, label });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}









