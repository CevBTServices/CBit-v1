import { z } from 'zod';

const createYasalMetinSchema = z.object({
  baslik: z.string().min(1),
  baslikEn: z.string().optional().nullable(),
  aciklama: z.string().min(1),
  aciklamaEn: z.string().optional().nullable(),
  dosyaYolu: z.string().min(1),
});

const updateYasalMetinSchema = z.object({
  baslik: z.string().optional(),
  baslikEn: z.string().optional().nullable(),
  aciklama: z.string().optional(),
  aciklamaEn: z.string().optional().nullable(),
  dosyaYolu: z.string().optional(),
});

export { createYasalMetinSchema, updateYasalMetinSchema };
