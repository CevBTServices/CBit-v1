import { z } from 'zod';

const createHaberSchema = z.object({
  haberAdi: z.string().min(1),
  haberAdiEn: z.string().optional().nullable(),
  haberDetayi: z.string().min(1),
  haberDetayiEn: z.string().optional().nullable(),
  haberResmi: z.string().min(1),
});

const updateHaberSchema = z.object({
  haberAdi: z.string().optional(),
  haberAdiEn: z.string().optional().nullable(),
  haberDetayi: z.string().optional(),
  haberDetayiEn: z.string().optional().nullable(),
  haberResmi: z.string().optional(),
});

export { createHaberSchema, updateHaberSchema };
