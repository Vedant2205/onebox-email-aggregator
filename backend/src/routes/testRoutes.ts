import { Router } from 'express';
import { TestController } from '../controllers/testController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const createTestRoutes = (controller: TestController): Router => {
  const router = Router();

  router.post('/slack', asyncHandler(controller.testSlack));
  router.post('/webhook', asyncHandler(controller.testWebhook));

  return router;
};









