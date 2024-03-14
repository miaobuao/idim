import type { MiddlewareBuilder } from '../trpc'

import { User } from '@repo/db'
import { eq } from 'drizzle-orm'

import { UnauthorizedError } from '../utils/errors'

export const AuthMiddleware = (async ({ ctx, next }) => {
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
        },
      })
    }
  }
  throw UnauthorizedError
}) satisfies MiddlewareBuilder
