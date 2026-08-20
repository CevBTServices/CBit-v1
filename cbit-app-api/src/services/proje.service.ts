import { prisma } from '../libs';

interface IProjeData {
  projeAdi:          string;
  projeAdiEn?:        string | null;
  projeDetayi?:       string | null;
  projeDetayiEn?:     string | null;
  projeResmi?:        string | null;
  beyazAlan?:         string | null;
  sertifikasyon?:     string | null;
  itGucu?:            string | null;
  toplamKuruluGuc?:   string | null;
  projeSuresi?:       string | null;
  toplamInsaatAlani?: string | null;
  durum?:             string | null;
  durumEn?:           string | null;
}

type IProjeUpdateData = Partial<IProjeData>;

const createProje = async (data: IProjeData) => {
  return prisma.proje.create({ data });
};

const listAllProjeler = async () => {
  return prisma.proje.findMany({ orderBy: { createdAt: 'desc' } });
};

const findProjeById = async (id: string) => {
  return prisma.proje.findUnique({ where: { id } });
};

const updateProje = async (id: string, data: IProjeUpdateData) => {
  return prisma.proje.update({ where: { id }, data });
};

const deleteProje = async (id: string) => {
  return prisma.proje.delete({ where: { id } });
};

export { createProje, listAllProjeler, findProjeById, updateProje, deleteProje };
