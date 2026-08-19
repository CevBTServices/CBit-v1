import { Router } from 'express';
import { validate, validateId } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createHaberHandler, listAllHaberHandler, updateHaberHandler, deleteHaberHandler, findHaberHandler } from '../controllers/haber.controller';
import { createHaberSchema, updateHaberSchema } from '../schemas/haber.schema';

const router = Router();

router.post('/create', authMiddleware, validate(createHaberSchema), createHaberHandler);

router.get('/our-news', listAllHaberHandler);
router.get('/find/:id', validateId, findHaberHandler);

router.patch('/update/:id', authMiddleware, validateId, validate(updateHaberSchema), updateHaberHandler);

router.delete('/delete/:id', authMiddleware, validateId, deleteHaberHandler);

export default router;
