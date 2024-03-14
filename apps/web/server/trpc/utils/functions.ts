import type { DrizzleD1Database } from 'drizzle-orm/d1'

import { User } from '@repo/db'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { pipe } from 'fp-ts/lib/function'

import { InternalServerError } from './errors'

export function FindOneUserById(db: DrizzleD1Database) {
  return (id: number) => db.select().from(User).where(eq(User.id, id)).then(res => res[0]).catch(() => undefined)
}

export function FindOneUserByUsername(db: DrizzleD1Database) {
  return (username: string) => db.select().from(User).where(eq(User.username, username)).then(res => res[0]).catch(() => undefined)
}

export function FindOneUserByEmail(db: DrizzleD1Database) {
  return (email: string) => db.select().from(User).where(eq(User.email, email)).then(res => res[0]).catch(() => undefined)
}

export function ThrowErrorIfPromiseNull<TError extends Error = Error>(err: TError) {
  return async<TValue = any, TRecv = Promise<TValue>> (value: TRecv) => {
    const v = await value
    if (v)
      return v
    throw err
  }
}

export function SyncSelectOneOrThrowError<TError extends Error = Error>(idx: number, err: TError) {
  return <TValue = any>(arr: TValue[]) => {
    const v = arr[idx]
    if (v)
      return v
    throw err
  }
}

export function AsyncSelectOneOrThrowError<TError extends Error = Error>(idx: number, err: TError) {
  return async <TValue = any>(arr: Promise<TValue[]>) => pipe(
    await arr,
    SyncSelectOneOrThrowError(idx, err),
  )
}

export function RetryAsyncFunc(count: number) {
  return async<TValue = any> (func: () => Promise<TValue>) => {
    for (let i = 0; i < count; i++) {
      try {
        return await func()
      }
      catch (e) {
        if (i < count - 1)
          continue
        throw e
      }
    }
  }
}

/**
 * Rate limit
 * @param kv KVNamespace
 * @param key key
 * @param duration milliseconds
 */
export function CallRateLimit(kv: KVNamespace, key: string, duration: number) {
  return async<TValue = any> (fn: () => TValue) => {
    const lastRequest = await kv.get(key)
    if (lastRequest && Number(lastRequest) + duration > Date.now()) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: (Number(lastRequest) + duration - Date.now()).toString(),
      })
    }

    const res = await Promise.resolve(fn())
    kv.put(key, Date.now().toString()).catch(() => {
      throw InternalServerError
    })
    return res
  }
}
