import type { DrizzleD1Database } from 'drizzle-orm/d1'

import { User } from '@repo/db'
import { eq } from 'drizzle-orm'

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
  return async<TValue = unknown, TRecv = Promise<TValue>> (value: TRecv) => {
    const v = await value
    if (v)
      return v
    throw err
  }
}
