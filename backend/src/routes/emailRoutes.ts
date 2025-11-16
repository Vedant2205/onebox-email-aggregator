import { Router } from 'express';
import { EmailController } from '../controllers/emailController';
import { asyncHandler } from '../middlewares/asyncHandler';

export const createEmailRoutes = (controller: EmailController): Router => {
  const router = Router();

  router.get('/', asyncHandler(controller.searchEmails));
  router.get('/:id', asyncHandler(controller.getEmailById));
  router.post('/:id/classify', asyncHandler(controller.classifyEmail));

  return router;
};









