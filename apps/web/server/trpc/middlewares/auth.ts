import type { MiddlewareBuilder } from '../trpc'

import { User } from '@repo/db'
import { eq } from 'drizzle-orm'

import { UnauthorizedError } from '../utils/errors'

export const AuthMiddleware = (async ({ ctx, next }) => {
  if (ctx.token?.id) {
    const user = await ctx.db.query.User.findFirst({
      where: eq(User.id, ctx.token.id),
      columns: {
        id: true,
        username: true,
        email: true,
        ctime: true,
      },
    })
    if (user) {
      return next({
        ctx: {
          user,
        },
      })
    }
  }
  throw UnauthorizedError
}) satisfies MiddlewareBuilder
