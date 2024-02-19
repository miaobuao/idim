import Logger from 'pino';

export const logger = Logger();

logger.level = process.env.LOG_LEVEL ?? 'error';
