import type { Context } from './context'

import { User } from '@repo/db'
import { initTRPC } from '@trpc/server'
import { eq } from 'drizzle-orm'

import { UnauthorizedError } from './utils/errors'

export const t = initTRPC.context<Context>().create({})
export type TRPCErrorSchema = ReturnType<
  (typeof t)['_config']['errorFormatter']
>
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (ctx.token?.id) {
    const user = await ctx.db.select({
      id: User.id,
      username: User.username,
      email: User.email,
      ctime: User.ctime,
    }).from(User).where(
      eq(User.id, ctx.token.id),
    ).limit(1)
    if (user && user[0]) {
      return next({
        ctx: {
          user: user[0],
          token: ctx.token,
        },
      })
    }
  }
  throw UnauthorizedError
})
