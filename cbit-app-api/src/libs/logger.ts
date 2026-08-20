import pino from 'pino';

const { NODE_ENV } = process.env;

const logger = pino(
  {
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  NODE_ENV === 'development' ? pino.transport({ target: 'pino-pretty', options: { colorize: true } }) : undefined,
);

export { logger };
