import { Request, Response, NextFunction } from 'express';

// IP istek kayıtlarını ve zaman damgalarını tutan harita
const ipRequestMap = new Map<string, number[]>();

// Hafıza sızıntılarını (Memory Leak) önlemek için her 5 dakikada bir eski kayıtları süpüren otomatik mekanizma
setInterval(() => {
  const now = Date.now();
  const windowMs = 60000;
  for (const [ip, requests] of ipRequestMap.entries()) {
    const validRequests = requests.filter((time) => now - time < windowMs);
    if (validRequests.length === 0) {
      ipRequestMap.delete(ip); // Süresi dolmuş IP'leri haritadan silerek RAM yükünü sıfırlıyoruz
    } else {
      ipRequestMap.set(ip, validRequests);
    }
  }
}, 300000); // 5 dakikada bir (300.000 ms) çalışır

export const contactRateLimiter = (req: Request, res: Response, next: NextFunction): any => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.ip || 'anonymous';
  const now = Date.now();
  const windowMs = 60000; // 1 dakika penceresi
  const maxRequests = 3; // İzin verilen maksimum istek adeti

  let requests = ipRequestMap.get(ip) || [];
  
  // Süresi dolmuş (1 dakikadan eski) istek zaman damgalarını filtrele
  requests = requests.filter((time) => now - time < windowMs);

  if (requests.length >= maxRequests) {
    return res.status(429).json({
      message: 'Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.',
    });
  }

  // İstek zaman damgasını ekliyoruz
  requests.push(now);
  ipRequestMap.set(ip, requests);
  next();
};
