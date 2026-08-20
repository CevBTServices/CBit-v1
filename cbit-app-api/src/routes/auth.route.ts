import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { loginHandler, logoutHandler, changePasswordHandler, verifyHandler } from '../controllers/auth.controller';
import { loginSchema, changePasswordSchema } from '../schemas/auth.schema';
import { authMiddleware } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

router.post('/login', rateLimiter(5, 60000), validate(loginSchema), loginHandler);
router.post('/logout', authMiddleware, logoutHandler);
router.post('/change-password', authMiddleware, validate(changePasswordSchema), changePasswordHandler);
router.get('/verify', authMiddleware, verifyHandler);

export default router;
