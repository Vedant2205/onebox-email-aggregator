import express from 'express';
import { config } from './config/env';
import { logger } from './config/logger';
import { ImapService } from './imap/imapService';
import { ElasticService } from './elastic/elasticService';
import { ClassificationService } from './classification/classificationService';
import { NotificationService } from './notifications/notificationService';
import { RAGService } from './rag/ragService';
import { ImapController } from './controllers/imapController';
import { EmailController } from './controllers/emailController';
import { RAGController } from './controllers/ragController';
import { TestController } from './controllers/testController';
import { createImapRoutes } from './routes/imapRoutes';
import { createEmailRoutes } from './routes/emailRoutes';
import { createRagRoutes } from './routes/ragRoutes';
import { createTestRoutes } from './routes/testRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize services
const imapService = new ImapService();
const elasticService = new ElasticService();
const classificationService = new ClassificationService();
const notificationService = new NotificationService();
const ragService = new RAGService(elasticService);

// Initialize controllers
const imapController = new ImapController(imapService);
const emailController = new EmailController(
  elasticService,
  classificationService,
  notificationService
);
const ragController = new RAGController(ragService);
const testController = new TestController(notificationService, elasticService);

// Routes
app.use('/api/imaps', createImapRoutes(imapController));
app.use('/api/emails', createEmailRoutes(emailController));
app.use('/api/rag', createRagRoutes(ragController));
app.use('/api/test', createTestRoutes(testController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Initialize and start
async function start() {
  try {
    // Initialize Elasticsearch
    await elasticService.initialize();
    logger.info('Elasticsearch initialized');

    // Initialize RAG knowledge base
    await ragService.initializeKnowledgeBase();
    logger.info('RAG knowledge base initialized');

    // Connect IMAP accounts
    imapService.on('email', async ({ email, accountId }) => {
      logger.info(`New email received: ${email.id} from account ${accountId}`);

      try {
        // Index email
        await elasticService.indexEmail(email);

        // Classify email
        const label = await classificationService.classifyEmail(
          email.subject,
          email.text,
          email.from
        );

        // Update labels
        await elasticService.updateEmailLabels(email.id, [label]);

        logger.info(`Email ${email.id} classified as: ${label}`);

        // If interested, send notifications
        if (label === 'Interested') {
          const emailDoc = await elasticService.getEmailById(email.id);
          if (emailDoc) {
            await notificationService.handleInterestedEmail(emailDoc);
          }
        }
      } catch (error) {
        logger.error(`Error processing email ${email.id}:`, error);
      }
    });

    await imapService.connectAll();
    logger.info('IMAP service started');

    // Start server
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await imapService.disconnectAll();
  await ragService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await imapService.disconnectAll();
  await ragService.close();
  process.exit(0);
});

start();









