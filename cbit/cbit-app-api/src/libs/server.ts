import express, { NextFunction, Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import pinoHTTP from 'pino-http';
import cors from 'cors';
import morgan from 'morgan';
import { logger } from '../libs';
import path from 'path';
import { API_ROUTES, API_VERSION, HTTP_STATUS_CODE } from '../helpers';
import { haberRoute, authRoute, projeRoute, messageRoute, uploadRoute, ayarlarRoute, isOrtaklariRoute } from '../routes';
import { Prisma } from '../generated/prisma';
import { csrfProtection } from '../middlewares/csrf.middleware';
import { sanitizeBody } from '../middlewares/sanitize.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { contentTypeMiddleware } from '../middlewares/contentType.middleware';
import { securityHeadersMiddleware } from '../middlewares/headers.middleware';

const { PORT = '2000', NODE_ENV, CORS_ORIGIN } = process.env;

if (!PORT) throw new Error('PORT tanımlı değil');

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:4102'];

const corsOptions = {
  credentials: true,
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
};

const server = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', true); // Trust reverse proxies (Nginx)

  if (NODE_ENV === 'development') {
    app.use(morgan('combined'));
  } else {
    app.use(
      pinoHTTP({
        logger,
        customLogLevel: function (_req, res, err) {
          if (res.statusCode === HTTP_STATUS_CODE.UNAUTHORIZED) return 'warn';
          if (res.statusCode === HTTP_STATUS_CODE.NOT_FOUND) return 'error';
          if (res.statusCode >= HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR || err) return 'error';
          if (res.statusCode >= 300 && res.statusCode < 400) return 'silent';
          return 'info';
        },
        customSuccessMessage: function (req, res) {
          if (res.statusCode === HTTP_STATUS_CODE.NOT_FOUND) {
            return `${req.method} ${req.url} ${res.statusCode} resource not found`;
          }
          return `${req.method} ${req.url} ${res.statusCode} completed`;
        },
      }),
    );
  }

  app.use(cors(corsOptions));
  app.use(securityHeadersMiddleware);
  app.use(contentTypeMiddleware);
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '1mb' }));
  app.use(sanitizeBody);
  app.use(cookieParser());
  app.use(csrfProtection);

  app.all('/', (_req, res): any => res.sendStatus(HTTP_STATUS_CODE.OK));

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

  app.use(`${API_VERSION.V1}${API_ROUTES.HABER}`, haberRoute);
  app.use(`${API_VERSION.V1}${API_ROUTES.AUTH}`, authRoute);
  app.use(`${API_VERSION.V1}${API_ROUTES.MESSAGE}`, messageRoute);
  app.use(`${API_VERSION.V1}/uploads`, uploadRoute);
  app.use(`${API_VERSION.V1}${API_ROUTES.PROJE}`, projeRoute);
  app.use(`${API_VERSION.V1}${API_ROUTES.AYARLAR}`, ayarlarRoute);
  app.use(`${API_VERSION.V1}${API_ROUTES.ISORTAKLARI}`, isOrtaklariRoute);

  /*
  ! Eğer ki bir URL backend'de yoksa otomatik olarak 404 Not Found hatası yaratıp onu yönetim sistemine iletir.
  app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    next(err);
  }); */

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: 'Kayıt bulunamadı.' });
      }
      if (err.code === 'P2002') {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: 'Bu kayıt zaten mevcut.' });
      }
    }

    const statusCode = err.statusCode ?? HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    const isTrusted = err.isOperational === true;
    const message = isTrusted || NODE_ENV === 'development' ? err.message : 'Bir sunucu hatası oluştu.';

    logger.error(`[EXPRESS ERROR] ${statusCode} ${err.message}`);
    res.status(statusCode).json({ message });
  });

  return new Promise((resolve) => {
    const host = '0.0.0.0'; //*Tailscale den açacağım için böyle yaptım.
    app.listen(Number(PORT), host, () => {
      logger.info(`[EXPRESS APP]\tSuccessfully opened on http://${host}:${PORT}`);
      resolve(null);
    });
  });
};

export { server };
