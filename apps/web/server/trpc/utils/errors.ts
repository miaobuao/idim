import { buildLanguageSource } from '@repo/locales'
import { TRPCError } from '@trpc/server'

const source = buildLanguageSource()

export const InvalidEmailOrPasswordError = new TRPCError({
  code: 'FORBIDDEN',
  message: source.invalid_email_or_password,
})

export const UnauthorizedError = new TRPCError({
  code: 'UNAUTHORIZED',
})

export const UserAlreadyExistsError = new TRPCError({
  code: 'CONFLICT',
  message: source.email_or_name_alreay_exists,
})
