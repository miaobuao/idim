export default {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  JWT_ISSUER: process.env.JWT_ISSUER!,
}
