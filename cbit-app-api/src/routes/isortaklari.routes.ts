import { Router } from 'express';
import {
  getAllIsOrtaklari,
  createIsOrtagi,
  updateIsOrtagi,
  deleteIsOrtagi,
} from '../controllers/isortaklari.controller';

const router = Router();

router.get('/', getAllIsOrtaklari);
router.post('/', createIsOrtagi);
router.put('/:id', updateIsOrtagi);
router.delete('/:id', deleteIsOrtagi);

export default router;
