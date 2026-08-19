import { logger, server, prisma } from './libs';
import { hashPassword } from './helpers';

const seedAdmin = async () => {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await hashPassword(password);
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      logger.warn(`[POSTGRESQL] Default admin user created! Username: ${username}, Password: ${password}. Please change it immediately.`);
    }
  } catch (error) {
    logger.error(`[POSTGRESQL] Admin seeding failed: ${error}`);
  }
};

const app = async () => {
  logger.info('[NETWORK APP]\tSTARTING ');
  await prisma.$connect();
  logger.info('[POSTGRESQL]\tSuccessfully connected to the database');
  await seedAdmin();
  await server();
};

app()
  .then(async () => {
    logger.info('[NETWORK APP]\tSTARTED');
  })
  .catch((err) => {
    console.log(err);

    logger.error(`[NETWORK APP]\tNOT STARTED ${err}`);

    process.exit();
  });
