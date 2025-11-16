import { Request, Response } from 'express';
import { ImapService } from '../imap/imapService';

export class ImapController {
  constructor(private imapService: ImapService) {}

  reconnect = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.imapService.reconnectAll();
      res.json({ message: 'IMAP accounts reconnected successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const accounts = this.imapService.getConnectedAccounts();
      res.json({ connectedAccounts: accounts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}









