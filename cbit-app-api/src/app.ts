import { logger, server, prisma } from './libs';
import { hashPassword } from './helpers';

const seedAdmin = async () => {
  try {
    const username = 'cbitadmin';
    const password = 'Hwx9B82U_d';
    const hashedPassword = await hashPassword(password);
    
    await prisma.admin.upsert({
      where: { username },
      update: { password: hashedPassword },
      create: {
        username,
        password: hashedPassword,
      },
    });
    logger.warn(`[POSTGRESQL] Admin user ensured via upsert! Username: ${username}`);
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
