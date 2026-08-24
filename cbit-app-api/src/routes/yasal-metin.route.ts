import { Router } from 'express';
import { getList, getById, create, update, remove } from '../controllers/yasal-metin.controller';

const router = Router();

router.get('/our-documents', getList);
router.get('/find/:id', getById);
router.post('/create', create);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);

export default router;
