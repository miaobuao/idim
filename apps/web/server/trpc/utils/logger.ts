import Logger from 'pino'

import config from './config'

export const logger = Logger()

logger.level = config.LOG_LEVEL
