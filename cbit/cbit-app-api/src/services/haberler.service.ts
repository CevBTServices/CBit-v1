import { prisma } from '../libs';

interface IHaberData {
  haberAdi: string;
  haberAdiEn?: string;
  haberDetayi: string;
  haberDetayiEn?: string;
  haberResmi: string;
}

type IHaberUpdateData = Partial<IHaberData>;

const createHaber = async (data: IHaberData) => {
  const h = await prisma.haberler.create({ data });
  return h;
};

const listAllHaber = async () => {
  return prisma.haberler.findMany({ orderBy: { createdAt: 'desc' } });
};

const updateHaber = async (id: string, data: IHaberUpdateData) => {
  const h = await prisma.haberler.update({
    where: { id },
    data,
  });
  return h;
};

const deleteHaber = async (id: string) => {
  const h = await prisma.haberler.delete({ where: { id } });
  return h;
};

const findHaberById = async (id: string) => {
  const h = await prisma.haberler.findUnique({ where: { id } });
  return h;
};

export { createHaber, listAllHaber, updateHaber, deleteHaber, findHaberById };
