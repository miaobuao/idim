const config = useRuntimeConfig()

export default {
  JWT_SECRET: config.JWT_SECRET,
  OAUTH_JWT_EXPIRES_IN: config.OAUTH_JWT_EXPIRES_IN,
  SMTP_API_URL: config.SMTP_API_URL,
  SMTP_API_AES_KEY: config.SMTP_API_AES_KEY,
  SMTP_API_AES_IV: config.SMTP_API_AES_IV,
  JWT_ISSUER: config.JWT_ISSUER,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  ...config.public,
} as const
