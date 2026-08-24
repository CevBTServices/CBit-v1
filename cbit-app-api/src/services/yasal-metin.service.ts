import { prisma } from '../libs';

const getAllYasalMetinler = async () => {
  return prisma.yasalMetin.findMany({
    orderBy: [
      { createdAt: 'desc' }
    ],
  });
};

const getYasalMetinById = async (id: string) => {
  return prisma.yasalMetin.findUnique({
    where: { id },
  });
};

const createYasalMetin = async (data: any) => {
  return prisma.yasalMetin.create({
    data,
  });
};

const updateYasalMetin = async (id: string, data: any) => {
  return prisma.yasalMetin.update({
    where: { id },
    data,
  });
};

const deleteYasalMetin = async (id: string) => {
  return prisma.yasalMetin.delete({
    where: { id },
  });
};

export {
  getAllYasalMetinler,
  getYasalMetinById,
  createYasalMetin,
  updateYasalMetin,
  deleteYasalMetin,
};
