import { prisma } from '../libs';

const findAdminByUsername = async (username: string) => {
  return prisma.admin.findUnique({ where: { username } });
};

const updateAdminPassword = async (username: string, hashedPassword: string) => {
  return prisma.admin.update({
    where: { username },
    data: { password: hashedPassword },
  });
};

export { findAdminByUsername, updateAdminPassword };
