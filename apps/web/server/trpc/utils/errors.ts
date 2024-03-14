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

export const InternalServerError = new TRPCError({
  code: 'INTERNAL_SERVER_ERROR',
  message: source.internal_server_error,
})

export const UserAlreadyExistsError = new TRPCError({
  code: 'CONFLICT',
  message: source.email_or_name_alreay_exists,
})

export const UserEmailNotRegisteredError = new TRPCError({
  code: 'NOT_FOUND',
  message: source.email_not_registered,
})

export const InvalidVerifyCodeError = new TRPCError({
  code: 'BAD_REQUEST',
  message: source.invalid_verify_code,
})

export const PostNotFoundError = new TRPCError({
  code: 'NOT_FOUND',
  message: source.postNodeFound,
})
