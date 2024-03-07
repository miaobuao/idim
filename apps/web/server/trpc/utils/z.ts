import { buildLanguageSource } from '@repo/locales'
import z from 'zod'

export const source = buildLanguageSource()

export const ZEmail = z.string().trim().email(source.invalid_email)
