import { buildLanguageSource } from '@repo/locales'
import z from 'zod'

export const source = buildLanguageSource()

export const EmailDto = z.string().trim().email(source.invalid_email)
export const PwdDto = z.string().trim().min(10)
export const IdDto = z.number().int()
