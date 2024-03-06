import post from './modules/post'
import session from './modules/session'
import user from './modules/user'
import { t } from './trpc'

export const appRouter = t.mergeRouters(
  user,
  post,
  session,
)
export type AppRouter = typeof appRouter
