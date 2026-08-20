import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getAyarlarHandler, updateAyarlarHandler } from '../controllers/ayarlar.controller';

const router = Router();

// Public — web sitesi açılışında ayarları çeker
router.get('/site', getAyarlarHandler);

// Admin korumalı — ayarları günceller
router.put('/site/update', authMiddleware, updateAyarlarHandler);

export default router;
