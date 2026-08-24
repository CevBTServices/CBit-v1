import { Router } from 'express';
import { createMessageHandler, listAllMessagesHandler, deleteMessageHandler } from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { messageLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// Public contact submission with rate limiting
router.post('/', messageLimiter, createMessageHandler);

// Protected admin routes
router.get('/', authMiddleware, listAllMessagesHandler);
router.delete('/:id', authMiddleware, deleteMessageHandler);

export default router;
