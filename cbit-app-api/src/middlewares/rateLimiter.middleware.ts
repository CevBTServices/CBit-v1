import rateLimit from 'express-rate-limit';

// Genel/Standart API limiti (Örn: /news, /projects, /yasal-metinler vs.)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakikada en fazla 100 istek
  message: { message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Auth limiti (Brute-force koruması)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10, // Her IP için 15 dakikada en fazla 10 giriş denemesi
  message: { message: 'Çok fazla giriş denemesi yaptınız. Lütfen 15 dakika sonra tekrar deneyin.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Mesaj/İletişim limiti (Spam koruması)
export const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // Her IP için 1 saatte en fazla 5 mesaj
  message: { message: 'Çok fazla mesaj gönderdiniz. Lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Upload limiti
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // Her IP için 15 dakikada en fazla 20 dosya yükleme
  message: { message: 'Çok fazla dosya yüklediniz. Lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true, 
  legacyHeaders: false,
});
