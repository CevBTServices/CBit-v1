import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middlewares/auth.middleware';
import { HTTP_STATUS_CODE } from '../helpers';

const router = Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter (restrict to images)
const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Yalnızca JPEG, JPG, PNG ve WEBP formatındaki resimler yüklenebilir.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// POST /v1/upload
router.post('/', authMiddleware, (req: any, res: any, next: any) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: 'Lütfen bir dosya yükleyin.' });
    }
    const fileUrl = `/api/uploads/${req.file.filename}`;
    return res.status(HTTP_STATUS_CODE.OK).json({ url: fileUrl });
  });
});

export default router;
