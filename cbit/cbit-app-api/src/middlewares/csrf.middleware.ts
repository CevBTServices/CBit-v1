import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4102'];

export const csrfProtection = (req: Request, res: Response, next: NextFunction): any => {
  // Safe methods do not require CSRF protection
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  if (!origin) {
    return res.status(HTTP_STATUS_CODE.FORBIDDEN || 403).json({ message: 'Güvenlik hatası: Origin veya Referer bilgisi bulunamadı.' });
  }

  try {
    const parsedOrigin = new URL(origin).origin;
    const matched = allowedOrigins.some((allowed) => {
      try {
        return new URL(allowed).origin === parsedOrigin;
      } catch {
        return false;
      }
    });

    if (!matched) {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN || 403).json({ message: 'Güvenlik hatası: Yetkisiz kaynak dizini (CSRF engellendi).' });
    }
  } catch {
    return res.status(HTTP_STATUS_CODE.FORBIDDEN || 403).json({ message: 'Güvenlik hatası: Geçersiz Origin/Referer formatı.' });
  }

  next();
};
