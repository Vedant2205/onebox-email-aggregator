import { Router } from 'express';
import { RAGController } from '../controllers/ragController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const createRagRoutes = (controller: RAGController): Router => {
  const router = Router();

  router.post('/suggest-reply', asyncHandler(controller.suggestReply));

  return router;
};









