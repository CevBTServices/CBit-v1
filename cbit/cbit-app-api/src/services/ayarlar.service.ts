import { prisma } from '../libs';

interface IAyarlarUpdateData {
  projelerAktif?: boolean;
  haberlerAktif?: boolean;
  isOrtaklariAktif?: boolean;
}

/**
 * Singleton satırı getirir; yoksa varsayılan değerlerle oluşturur.
 */
const getOrCreateAyarlar = async () => {
  const existing = await prisma.siteAyarlari.findFirst();
  if (existing) return existing;

  return prisma.siteAyarlari.create({
    data: {
      projelerAktif: false,
      haberlerAktif: true,
      isOrtaklariAktif: true,
    },
  });
};

/**
 * Mevcut singleton kaydını günceller; yoksa önce oluşturur.
 */
const updateAyarlar = async (data: IAyarlarUpdateData) => {
  const existing = await getOrCreateAyarlar();
  return prisma.siteAyarlari.update({
    where: { id: existing.id },
    data,
  });
};

export { getOrCreateAyarlar, updateAyarlar };
