import { User } from '@repo/db'
import { buildLanguageSource } from '@repo/locales'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'
import { bcryptVerify } from '../utils/bcrypt'
import { signToken } from '../utils/jwt'
import { ZEmail } from '../utils/z'

export const source = buildLanguageSource()

export default router({
  session: {
    create: publicProcedure.input(
      z.object({
        email: ZEmail,
        password: z.string(),
      }),
    ).mutation(async ({ input, ctx }) => {
      const user = (
        await ctx.db.select({
          id: User.id,
          password: User.pwd,
          username: User.username,
        })
          .from(User)
          .where(eq(User.email, input.email))
          .limit(1)
          .then(async (records) => {
            if (records.length === 0 || !(await bcryptVerify(input.password, records[0].password))) {
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: source.invalid_email_or_password,
              })
            }
            return records[0]
          })
      )
      return {
        id: user.id,
        username: user.username,
        token: await signToken({ id: user.id }),
      }
    }),
    renew: protectedProcedure.mutation(async ({ ctx }) => {
      return await signToken({ id: ctx.user.id })
    }),
    getUserInfo: protectedProcedure.query(({ ctx }) => {
      return {
        id: ctx.user.id,
        username: ctx.user.username,
      }
    }),
  },
})