import { Client } from '@elastic/elasticsearch';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { EmailMetadata } from '../utils/emailParser';

export interface EmailDocument {
  id: string;
  accountId: string;
  folder: string;
  subject: string;
  from: string;
  to: string[];
  text: string;
  html: string;
  date: string;
  labels?: string[];
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export class ElasticService {
  private client: Client;
  private indexName = 'emails';

  constructor() {
    this.client = new Client({
      node: config.elasticsearch.url,
    });
  }

  async initialize(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index: this.indexName });
      
      if (!exists) {
        await this.client.indices.create({
          index: this.indexName,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                accountId: { type: 'keyword' },
                folder: { type: 'keyword' },
                subject: { type: 'text', analyzer: 'standard' },
                from: { type: 'keyword' },
                to: { type: 'keyword' },
                text: { type: 'text', analyzer: 'standard' },
                html: { type: 'text', analyzer: 'standard' },
                date: { type: 'date' },
                labels: { type: 'keyword' },
                attachments: {
                  type: 'nested',
                  properties: {
                    filename: { type: 'text' },
                    contentType: { type: 'keyword' },
                    size: { type: 'long' },
                  },
                },
              },
            },
          },
        });
        logger.info(`Created Elasticsearch index: ${this.indexName}`);
      }
    } catch (error) {
      logger.error('Error initializing Elasticsearch:', error);
      throw error;
    }
  }

  async indexEmail(email: EmailMetadata, labels?: string[]): Promise<void> {
    try {
      const doc: EmailDocument = {
        id: email.id,
        accountId: email.accountId,
        folder: email.folder,
        subject: email.subject,
        from: email.from,
        to: email.to,
        text: email.text,
        html: email.html,
        date: email.date.toISOString(),
        labels: labels || [],
        attachments: email.attachments,
      };

      await this.client.index({
        index: this.indexName,
        id: email.id,
        document: doc,
      });

      logger.debug(`Indexed email: ${email.id}`);
    } catch (error) {
      logger.error(`Error indexing email ${email.id}:`, error);
      throw error;
    }
  }

  async updateEmailLabels(emailId: string, labels: string[]): Promise<void> {
    try {
      await this.client.update({
        index: this.indexName,
        id: emailId,
        body: {
          doc: {
            labels,
          },
        },
      });
    } catch (error) {
      logger.error(`Error updating labels for email ${emailId}:`, error);
      throw error;
    }
  }

  async searchEmails(params: {
    q?: string;
    account?: string;
    folder?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }): Promise<{ emails: EmailDocument[]; total: number }> {
    try {
      const { q, account, folder, fromDate, toDate, page = 1, size = 20 } = params;
      const from = (page - 1) * size;

      const must: any[] = [];
      const filters: any[] = [];

      if (q) {
        must.push({
          multi_match: {
            query: q,
            fields: ['subject^3', 'text', 'from', 'to'],
            type: 'best_fields',
          },
        });
      }

      if (account) {
        filters.push({ term: { accountId: account } });
      }

      if (folder) {
        filters.push({ term: { folder } });
      }

      if (fromDate || toDate) {
        const range: any = {};
        if (fromDate) range.gte = fromDate;
        if (toDate) range.lte = toDate;
        filters.push({ range: { date: range } });
      }

      const query: any = {};
      if (must.length > 0) {
        query.must = must;
      }
      if (filters.length > 0) {
        query.filter = filters;
      }

      const body: any = {
        from,
        size,
        sort: [{ date: { order: 'desc' } }],
      };

      if (Object.keys(query).length > 0) {
        body.query = { bool: query };
      } else {
        body.query = { match_all: {} };
      }

      const response = await this.client.search<EmailDocument>({
        index: this.indexName,
        body,
      });

      const emails = response.hits.hits.map((hit) => hit._source!);
      const total = response.hits.total as { value: number };

      return {
        emails,
        total: total.value,
      };
    } catch (error) {
      logger.error('Error searching emails:', error);
      throw error;
    }
  }

  async getEmailById(emailId: string): Promise<EmailDocument | null> {
    try {
      const response = await this.client.get<EmailDocument>({
        index: this.indexName,
        id: emailId,
      });

      return response._source || null;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      logger.error(`Error getting email ${emailId}:`, error);
      throw error;
    }
  }
}









