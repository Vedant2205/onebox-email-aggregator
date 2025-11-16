import { Pool } from 'pg';
import OpenAI from 'openai';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { ElasticService, EmailDocument } from '../elastic/elasticService';

export class RAGService {
  private pool: Pool;
  private openai: OpenAI;
  private elasticService: ElasticService;

  constructor(elasticService: ElasticService) {
    this.pool = new Pool({
      connectionString: config.postgres.url,
    });
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.elasticService = elasticService;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error('Error generating embedding:', error);
      throw error;
    }
  }

  async findSimilarKnowledge(emailText: string, limit: number = 3): Promise<string[]> {
    try {
      const embedding = await this.generateEmbedding(emailText);

      const query = `
        SELECT content, 1 - (embedding <=> $1::vector) as similarity
        FROM knowledge
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> $1::vector
        LIMIT $2
      `;

      // Format embedding as pgvector array string
      const embeddingStr = `[${embedding.join(',')}]`;
      const result = await this.pool.query(query, [embeddingStr, limit]);
      
      return result.rows.map((row) => row.content);
    } catch (error) {
      logger.error('Error finding similar knowledge:', error);
      throw error;
    }
  }

  async initializeKnowledgeBase(): Promise<void> {
    try {
      // Check if knowledge base already has embeddings
      const checkResult = await this.pool.query(
        'SELECT COUNT(*) FROM knowledge WHERE embedding IS NOT NULL'
      );
      
      if (parseInt(checkResult.rows[0].count) > 0) {
        logger.info('Knowledge base already initialized with embeddings');
        return;
      }

      // Generate embeddings for all knowledge entries without embeddings
      const result = await this.pool.query('SELECT id, content FROM knowledge WHERE embedding IS NULL');
      
      for (const row of result.rows) {
        try {
          const embedding = await this.generateEmbedding(row.content);
          
          // Format embedding as pgvector array string
          const embeddingStr = `[${embedding.join(',')}]`;
          await this.pool.query(
            'UPDATE knowledge SET embedding = $1::vector WHERE id = $2',
            [embeddingStr, row.id]
          );
          
          logger.debug(`Generated embedding for knowledge entry ${row.id}`);
        } catch (error) {
          logger.error(`Error generating embedding for knowledge ${row.id}:`, error);
        }
      }

      logger.info('Knowledge base embeddings initialized');
    } catch (error) {
      logger.error('Error initializing knowledge base:', error);
    }
  }

  async suggestReply(emailId: string): Promise<string> {
    try {
      const email = await this.elasticService.getEmailById(emailId);
      
      if (!email) {
        throw new Error(`Email ${emailId} not found`);
      }

      // Find similar knowledge
      const emailText = `${email.subject}\n\n${email.text}`;
      const similarKnowledge = await this.findSimilarKnowledge(emailText, 3);

      // Build prompt with context
      const context = similarKnowledge.join('\n\n');
      
      const prompt = `You are a helpful email assistant. Based on the following context and the email below, suggest a professional and appropriate reply.

Context about our product/service:
${context}

Email to reply to:
Subject: ${email.subject}
From: ${email.from}
Body: ${email.text}

Generate a suggested reply that is:
- Professional and courteous
- Relevant to the email content
- Incorporates relevant information from the context
- Appropriate in tone and length

Reply:`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email assistant that helps draft appropriate email replies.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const suggestedReply = response.choices[0]?.message?.content?.trim() || '';
      
      logger.info(`Generated suggested reply for email: ${emailId}`);
      return suggestedReply;
    } catch (error) {
      logger.error(`Error generating suggested reply for email ${emailId}:`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

