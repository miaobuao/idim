import { env } from 'node:process'

export default {
  IS_DEVELOPMENT: env.NODE_ENV === 'development',
  LOG_LEVEL: env.LOG_LEVEL ?? 'info',
  JWT_SECRET: env.JWT_SECRET!,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN ?? '7d',
  JWT_ISSUER: env.JWT_ISSUER!,
}
