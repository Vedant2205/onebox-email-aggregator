import { ImapFlow, ImapFlowOptions, FetchMessageObject } from 'imapflow';
import { EventEmitter } from 'events';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { parseEmail, EmailMetadata } from '../utils/emailParser';

export interface ImapAccount {
  id: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  tls: boolean;
}

export interface EmailEvent {
  email: EmailMetadata;
  accountId: string;
}

export class ImapService extends EventEmitter {
  private clients: Map<string, ImapFlow> = new Map();
  private idleTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private isIdle: Map<string, boolean> = new Map();

  async connectAll(): Promise<void> {
    const accounts = config.imap.accounts as ImapAccount[];
    
    for (const account of accounts) {
      if (!account.host || !account.user || !account.pass) {
        logger.warn(`Skipping account ${account.id} - missing credentials`);
        continue;
      }

      try {
        await this.connectAccount(account);
      } catch (error) {
        logger.error(`Failed to connect account ${account.id}:`, error);
      }
    }
  }

  private async connectAccount(account: ImapAccount): Promise<void> {
    const options: ImapFlowOptions = {
      host: account.host,
      port: account.port,
      secure: account.tls,
      auth: {
        user: account.user,
        pass: account.pass,
      },
      logger: false,
    };

    const client = new ImapFlow(options);

    client.on('error', (error) => {
      logger.error(`IMAP error for account ${account.id}:`, error);
      this.reconnectAccount(account);
    });

    await client.connect();
    logger.info(`Connected to IMAP account: ${account.id}`);

    this.clients.set(account.id, client);

    // Initial sync - fetch last 30 days
    await this.syncRecentEmails(account.id, client);

    // Start IDLE mode
    this.startIdle(account.id, client);
  }

  private async syncRecentEmails(accountId: string, client: ImapFlow): Promise<void> {
    try {
      const lock = await client.getMailboxLock('INBOX');
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const messages = await client.search({
          since: thirtyDaysAgo,
        });

        logger.info(`Found ${messages.length} emails in last 30 days for account ${accountId}`);

        for (const seq of messages) {
          const message = await client.fetchOne(seq.toString(), {
            source: true,
            envelope: true,
          });

          if (message) {
            await this.processEmail(message, accountId, 'INBOX');
          }
        }
      } finally {
        lock.release();
      }
    } catch (error) {
      logger.error(`Error syncing recent emails for ${accountId}:`, error);
    }
  }

  private async startIdle(accountId: string, client: ImapFlow): Promise<void> {
    if (this.isIdle.get(accountId)) {
      return;
    }

    try {
      const lock = await client.getMailboxLock('INBOX');
      try {
        const idle = await client.idle();

        this.isIdle.set(accountId, true);
        logger.info(`IDLE mode started for account ${accountId}`);

        idle.on('exists', async () => {
          logger.info(`New email detected for account ${accountId}`);
          await this.fetchNewEmails(accountId, client);
        });

        idle.on('expunge', () => {
          logger.debug(`Email expunged for account ${accountId}`);
        });

        // Keep IDLE alive
        const keepAlive = setInterval(() => {
          if (this.isIdle.get(accountId)) {
            idle.keepAlive();
          } else {
            clearInterval(keepAlive);
          }
        }, 300000); // 5 minutes

        this.idleTimeouts.set(accountId, keepAlive as unknown as NodeJS.Timeout);
      } catch (error) {
        logger.error(`Error starting IDLE for ${accountId}:`, error);
        this.isIdle.set(accountId, false);
        lock.release();
        // Retry after delay
        setTimeout(() => this.startIdle(accountId, client), 5000);
      }
    } catch (error) {
      logger.error(`Error acquiring lock for IDLE ${accountId}:`, error);
      setTimeout(() => this.startIdle(accountId, client), 5000);
    }
  }

  private async fetchNewEmails(accountId: string, client: ImapFlow): Promise<void> {
    try {
      const lock = await client.getMailboxLock('INBOX');
      try {
        const status = await client.status('INBOX', { messages: true });
        const messages = await client.search({
          since: new Date(Date.now() - 60000), // Last minute
        });

        for (const seq of messages) {
          const message = await client.fetchOne(seq.toString(), {
            source: true,
            envelope: true,
          });

          if (message) {
            await this.processEmail(message, accountId, 'INBOX');
          }
        }
      } finally {
        lock.release();
      }
    } catch (error) {
      logger.error(`Error fetching new emails for ${accountId}:`, error);
    }
  }

  private async processEmail(
    message: FetchMessageObject,
    accountId: string,
    folder: string
  ): Promise<void> {
    try {
      if (!message.source) {
        return;
      }

      // message.source is a Buffer, pass it directly to mailparser
      const email = await parseEmail(message.source, accountId, folder);

      this.emit('email', { email, accountId } as EmailEvent);
    } catch (error) {
      logger.error(`Error processing email for ${accountId}:`, error);
    }
  }

  async reconnectAccount(account: ImapAccount): Promise<void> {
    const existing = this.clients.get(account.id);
    if (existing) {
      try {
        await existing.logout();
      } catch {
        // Ignore logout errors
      }
      this.clients.delete(account.id);
      this.isIdle.set(account.id, false);
      const timeout = this.idleTimeouts.get(account.id);
      if (timeout) {
        clearInterval(timeout);
        this.idleTimeouts.delete(account.id);
      }
    }

    await this.connectAccount(account);
  }

  async reconnectAll(): Promise<void> {
    const accounts = config.imap.accounts as ImapAccount[];
    for (const account of accounts) {
      await this.reconnectAccount(account);
    }
  }

  getConnectedAccounts(): string[] {
    return Array.from(this.clients.keys());
  }

  async disconnectAll(): Promise<void> {
    for (const [accountId, client] of this.clients.entries()) {
      try {
        this.isIdle.set(accountId, false);
        const timeout = this.idleTimeouts.get(accountId);
        if (timeout) {
          clearInterval(timeout);
        }
        await client.logout();
      } catch (error) {
        logger.error(`Error disconnecting ${accountId}:`, error);
      }
    }
    this.clients.clear();
    this.idleTimeouts.clear();
  }
}

