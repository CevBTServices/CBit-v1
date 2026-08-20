import { z } from 'zod';

const createProjeSchema = z.object({
  projeAdi:          z.string().min(1),
  projeAdiEn:        z.string().optional().nullable(),
  projeDetayi:       z.string().optional().nullable(),
  projeDetayiEn:     z.string().optional().nullable(),
  projeResmi:        z.string().optional().nullable(),
  beyazAlan:         z.string().optional().nullable(),
  sertifikasyon:     z.string().optional().nullable(),
  itGucu:            z.string().optional().nullable(),
  toplamKuruluGuc:   z.string().optional().nullable(),
  projeSuresi:       z.string().optional().nullable(),
  toplamInsaatAlani: z.string().optional().nullable(),
  durum:             z.string().optional().nullable(),
  durumEn:           z.string().optional().nullable(),
});

const updateProjeSchema = z.object({
  projeAdi:          z.string().optional(),
  projeAdiEn:        z.string().optional().nullable(),
  projeDetayi:       z.string().optional().nullable(),
  projeDetayiEn:     z.string().optional().nullable(),
  projeResmi:        z.string().optional().nullable(),
  beyazAlan:         z.string().optional().nullable(),
  sertifikasyon:     z.string().optional().nullable(),
  itGucu:            z.string().optional().nullable(),
  toplamKuruluGuc:   z.string().optional().nullable(),
  projeSuresi:       z.string().optional().nullable(),
  toplamInsaatAlani: z.string().optional().nullable(),
  durum:             z.string().optional().nullable(),
  durumEn:           z.string().optional().nullable(),
});

export { createProjeSchema, updateProjeSchema };
