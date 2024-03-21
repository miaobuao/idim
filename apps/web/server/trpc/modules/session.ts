import { buildLanguageSource } from '@repo/locales'
import { pipe } from 'fp-ts/function'
import z from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'
import { bcryptVerify } from '../utils/bcrypt'
import { InvalidEmailOrPasswordError } from '../utils/errors'
import { FindOneUserByEmail, ThrowErrorIfPromiseNull } from '../utils/functions'
import { signToken } from '../utils/jwt'
import { EmailDto } from '../utils/z'

export const source = buildLanguageSource()

export const CreateSessionDto = z.object({
  email: EmailDto,
  password: z.string().min(1),
})

export type CreateSessionType = z.infer<typeof CreateSessionDto>

export default router({
  session: {
    create: publicProcedure.input(CreateSessionDto).mutation(async ({ input, ctx }) => {
      return await pipe(
        input.email,
        FindOneUserByEmail(ctx.db),
        ThrowErrorIfPromiseNull(InvalidEmailOrPasswordError),
      ).then(async ({ pwd, id, username }) => {
        if (await bcryptVerify(input.password, pwd)) {
          return {
            id,
            username,
            email: input.email,
            token: await signToken({ id }),
          }
        }
        throw InvalidEmailOrPasswordError
      })
    }),

    renew: protectedProcedure.mutation(async ({ ctx }) => {
      return await signToken({ id: ctx.user.id })
    }),

    auth: protectedProcedure.query(({ ctx }) => {
      return {
        id: ctx.user.id,
        username: ctx.user.username,
        email: ctx.user.email,
      }
    }),

  },
})
