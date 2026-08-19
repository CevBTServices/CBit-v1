import { z } from 'zod';

const createMessageSchema = z.object({
  adSoyad: z.string().trim().min(1, 'Ad Soyad alanı zorunludur'),
  eposta: z.string().trim().email('Geçersiz e-posta adresi').min(1, 'E-posta alanı zorunludur'),
  konu: z.string().trim().min(1, 'Konu alanı zorunludur'),
  mesaj: z.string().trim().min(1, 'Mesaj alanı zorunludur'),
});

export { createMessageSchema };
