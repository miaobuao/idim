import { createNuxtApiHandler } from 'trpc-nuxt'

import { appRouter } from '../../trpc/router'
import { createContext } from '~/server/trpc/context'

export default createNuxtApiHandler({
  router: appRouter,
  createContext,
})
