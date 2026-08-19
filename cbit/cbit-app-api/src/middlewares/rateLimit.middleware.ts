import { Request, Response, NextFunction } from 'express';

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

// Periodically clean up expired records to prevent memory leakage
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipRequestMap.get(ip);

    if (!record || now > record.resetTime) {
      ipRequestMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;

    if (record.count > limit) {
      return res.status(429).json({
        message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
      });
    }

    next();
  };
};

export { rateLimiter };
