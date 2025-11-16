import { Router } from 'express';
import { ImapController } from '../controllers/imapController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const createImapRoutes = (controller: ImapController): Router => {
  const router = Router();

  router.post('/reconnect', asyncHandler(controller.reconnect));
  router.get('/status', asyncHandler(controller.getStatus));

  return router;
};









