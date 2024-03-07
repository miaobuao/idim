import type { H3Event } from 'h3'

import { verifyToken } from './utils/jwt'

async function abstractPayloadFromHeaders(headers: Headers) {
  const authorization = headers.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring(7)
    return await verifyToken(token)
      .then(d => ({ token: d.payload.data }))
      .catch(() => ({ token: null }))
  }
  return { token: null }
}

export async function createContext(ctx: H3Event) {
  try {
    return {
      ...await abstractPayloadFromHeaders(ctx.headers),
      ...ctx.context,
    }
  }
  catch {
    return {
      token: null,
      ...ctx.context,
    }
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
