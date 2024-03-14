import type { DrizzleD1Database } from 'drizzle-orm/d1'

import { drizzle } from 'drizzle-orm/d1'

export default defineEventHandler(async (event) => {
  const { D1 } = event.context.cloudflare.env
  event.context.db = drizzle(D1)
  event.context.kv = {
    rateLimit: event.context.cloudflare.env.KV_API_RATE_LIMIT,
  }
})

declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      env: Env
    }
    db: DrizzleD1Database
    kv: {
      rateLimit: KVNamespace
    }
  }
}

interface Env {
  D1: D1Database
  KV_API_RATE_LIMIT: KVNamespace
}
