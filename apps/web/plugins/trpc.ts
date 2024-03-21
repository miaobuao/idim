import type { AppRouter } from '~/server/trpc/router'

import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `/api/trpc`,
        headers: () => {
          const token = useTokenStore()
          return {
            Authorization: `Bearer ${token.value}`,
          }
        },
      }),
    ],
  })
  return {
    provide: {
      trpc,
    },
  }
})
