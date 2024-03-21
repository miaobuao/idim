import comment from './modules/comment'
import post from './modules/post'
import session from './modules/session'
import user from './modules/user'
import { publicProcedure, router, t } from './trpc'

export const appRouter = t.mergeRouters(
  user,
  post,
  session,
  comment,
  router({
    hi: publicProcedure.query(() => 'hi'),
  }),
)
export type AppRouter = typeof appRouter
