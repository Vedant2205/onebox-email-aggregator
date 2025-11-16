import { Request, Response } from 'express';
import { RAGService } from '../rag/ragService';

export class RAGController {
  constructor(private ragService: RAGService) {}

  suggestReply = async (req: Request, res: Response): Promise<void> => {
    try {
      const { emailId } = req.body;

      if (!emailId) {
        res.status(400).json({ error: 'emailId is required' });
        return;
      }

      const suggestedReply = await this.ragService.suggestReply(emailId);
      res.json({ emailId, suggestedReply });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}









