import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createProjeHandler,
  listAllProjelerHandler,
  findProjeHandler,
  updateProjeHandler,
  deleteProjeHandler,
} from '../controllers/proje.controller';
import { createProjeSchema, updateProjeSchema } from '../schemas/proje.schema';

const router = Router();

router.post('/create', authMiddleware, validate(createProjeSchema), createProjeHandler);

router.get('/our-projects', listAllProjelerHandler);
router.get('/find/:id', findProjeHandler);

router.patch('/update/:id', authMiddleware, validate(updateProjeSchema), updateProjeHandler);

router.delete('/delete/:id', authMiddleware, deleteProjeHandler);

export default router;
