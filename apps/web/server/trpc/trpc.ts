import type { Context } from './context'

import db from '@repo/db'
import { TRPCError, initTRPC } from '@trpc/server'

export const t = initTRPC.context<Context>().create({})
export type TRPCErrorSchema = ReturnType<
  (typeof t)['_config']['errorFormatter']
>
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (ctx.user?.id) {
    const user = await db.user.findUnique({
      where: { id: ctx.user.id },
    })
    if (user) {
      return next({
        ctx: { user },
      })
    }
  }
  throw new TRPCError({ code: 'UNAUTHORIZED' })
})
