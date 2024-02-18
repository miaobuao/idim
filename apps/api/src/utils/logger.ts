import * as log4js from 'log4js';

export const logger = log4js.getLogger('API');

logger.level = process.env.LOG_LEVEL ?? 'debug';
