import { User } from '@repo/db'
import { eq } from 'drizzle-orm'
import { pipe } from 'fp-ts/lib/function'
import { z } from 'zod'

import { EmailMiddleware } from '../middlewares/email'
import { publicProcedure, router } from '../trpc'
import { bcryptEncrypt } from '../utils/bcrypt'
import { InvalidVerifyCodeError, UserAlreadyExistsError, UserEmailNotRegisteredError, UserNotFoundError } from '../utils/errors'
import { CallRateLimit, ThrowErrorIfPromiseNull } from '../utils/functions'
import { EmailDto, IntDto, PwdDto } from '../utils/z'

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
        const limiter = CallRateLimit(kv.rateLimit, `verify-code:${input.email}`, 60_000)
        return await limiter(
          async () => {
            const { email } = await pipe(
              db.query.User.findFirst({
                where: eq(User.email, input.email),
                columns: {
                  email: true,
                },
              }),
              ThrowErrorIfPromiseNull(UserEmailNotRegisteredError),
            )
            const sender = await useSendEmail()
            const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
            await kv.cache.put(`verify-code-change-pwd:${email}`, code, {
              expiration: 600 + Math.round(Date.now() / 1000),
            })
            await sender({
              to: email,
              subject: 'Verify code for change password',
              type: 'html',
              body: `Your verify code is ${code}.`,
            })
          },
        )
      }),
    changePwd: publicProcedure.input(ChangeUserPwdFormDto).mutation(async ({ input: { email, code, password }, ctx: { kv, db } }) => {
      const realCode = await pipe(
        kv.cache.get(`verify-code-change-pwd:${email}`),
        ThrowErrorIfPromiseNull(InvalidVerifyCodeError),
      )
      if (realCode !== code)
        throw InvalidVerifyCodeError
      await kv.cache.delete(`verify-code-change-pwd:${email}`)
      const pwd = await bcryptEncrypt(password)
      await db.update(User).set({ pwd }).where(eq(User.email, email))
    }),

    getInfo: publicProcedure.input(z.object({ userId: IntDto.gte(0) })).query(({ input, ctx: { db } }) => pipe(
      db.query.User.findFirst({
        where: eq(User.id, input.userId),
        columns: {
          id: true,
          username: true,
        },
      }),
      ThrowErrorIfPromiseNull(UserNotFoundError),
    )),
  },
})
