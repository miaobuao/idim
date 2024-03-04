const config = useRuntimeConfig()

export default {
  JWT_SECRET: config.JWT_SECRET,
  JWT_EXPIRES_IN: config.JWT_EXPIRES_IN,
  JWT_ISSUER: config.JWT_ISSUER,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
} as const
