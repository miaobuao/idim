import type { Context } from './context'

import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import { AuthMiddleware } from './middlewares/auth'

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
})
export type TRPCErrorSchema = ReturnType<
  (typeof t)['_config']['errorFormatter']
>
export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(AuthMiddleware)

export type MiddlewareBuilder = Parameters<typeof publicProcedure['use']>['0']
