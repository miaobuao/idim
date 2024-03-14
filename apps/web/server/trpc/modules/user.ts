import { User, VerifyCode } from '@repo/db'
import { and, eq, gte } from 'drizzle-orm'
import { pipe } from 'fp-ts/lib/function'
import { z } from 'zod'

import { EmailMiddleware } from '../middlewares/email'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { bcryptEncrypt } from '../utils/bcrypt'
import { InternalServerError, InvalidVerifyCodeError, UserAlreadyExistsError, UserEmailNotRegisteredError } from '../utils/errors'
import { CallRateLimit, SyncSelectOneOrThrowError, ThrowErrorIfPromiseNull } from '../utils/functions'
import { EmailDto, PwdDto } from '../utils/z'

export const CreateUserDto = z.object({
  username: z.string().min(2),
  email: EmailDto,
  password: PwdDto,
})

export const SendVerifyCodeDto = z.object({
  email: EmailDto,
  locale: z.string(),
})

export const ChangeUserPwdFormDto = z.object({
  email: EmailDto,
  code: z.string(),
  password: PwdDto,
})

export type CreateUserType = z.infer<typeof CreateUserDto>

export default router({
  user: {
    create: publicProcedure
      .input(CreateUserDto)
      .mutation(async ({ input, ctx: { db } }) => {
        const password = await bcryptEncrypt(input.password)
        return db.insert(User).values({
          ...input,
          pwd: password,
        }).onConflictDoNothing().then((res) => {
          if (res.meta.changed_db)
            return true
          throw UserAlreadyExistsError
        })
      }),
    sendVerifyCodeToChangePwd: publicProcedure
      .use(EmailMiddleware)
      .input(SendVerifyCodeDto)
      .mutation(async ({ input, ctx: { db, kv, useSendEmail } }) => {
        const limiter = CallRateLimit(kv.rateLimit, verifyCodeKey(input.email), 60_000)
        return await limiter(
          async () => {
            const { email } = await db
              .select({ email: User.email })
              .from(User)
              .where(eq(User.email, input.email))
              .limit(1)
              .then(SyncSelectOneOrThrowError(0, UserEmailNotRegisteredError))
            const sender = await useSendEmail()
            const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
            const insertRes = await db.insert(VerifyCode).values({
              type: 'change-pwd',
              email: input.email,
              code,
              expiresAt: Date.now() + 10 * 60_000,
            })
            if (insertRes.meta.changed_db) {
              await sender({
                type: 'html',
                to: email,
                subject: 'Verify code for change password',
                body: `Your verify code is ${code}.`,
              })
              return true
            }
            throw InternalServerError
          },
        )
      }),
    changePwd: publicProcedure.input(ChangeUserPwdFormDto).mutation(async ({ input: { email, code, password }, ctx: { db } }) => {
      await pipe(
        db.select().from(VerifyCode).where(
          and(
            eq(VerifyCode.type, 'change-pwd'),
            eq(VerifyCode.email, email),
            eq(VerifyCode.code, code),
            gte(VerifyCode.expiresAt, Date.now()),
          ),
        ).limit(1),
        ThrowErrorIfPromiseNull(InvalidVerifyCodeError),
      )
      await db.delete(VerifyCode).where(
        and(
          eq(VerifyCode.type, 'change-pwd'),
          eq(VerifyCode.email, email),
        ),
      )
      const pwd = await bcryptEncrypt(password)
      await db.update(User).set({ pwd }).where(eq(User.email, email))
    }),

    getUserInfo: protectedProcedure.query(({ ctx }) => {
      return {
        id: ctx.user.id,
        username: ctx.user.username,
        email: ctx.user.email,
      }
    }),
  },
})

function verifyCodeKey(email: string) {
  return `VerifyCode:${email}`
}
