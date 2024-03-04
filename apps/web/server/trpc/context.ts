import { verifyToken } from './utils/jwt'

export async function createContext(ctx: any) {
  const authorization = ctx.headers.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring(7)
    return await verifyToken(token)
      .then(d => ({ user: { id: d.payload.data.id } }))
      .catch(() => ({ user: null }))
  }
  return { user: null }
}

export type Context = Awaited<ReturnType<typeof createContext>>
