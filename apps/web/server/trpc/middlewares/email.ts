import type { MiddlewareBuilder } from '../trpc'
import type { SMTPRequest } from 'smtp-forwarder'

import { EmailPool } from '@repo/db'
import crypto from 'crypto-js'
import { pipe } from 'fp-ts/lib/function'

import config from '../utils/config'
import { InternalServerError } from '../utils/errors'
import { AsyncSelectOneOrThrowError, RetryAsyncFunc } from '../utils/functions'

const KEY = crypto.enc.Hex.parse(config.SMTP_API_AES_KEY)
const IV = crypto.enc.Hex.parse(config.SMTP_API_AES_IV)
const encryptor = crypto.algo.AES.createEncryptor(KEY, { iv: IV })

export const EmailMiddleware = (async ({ next, ctx: { db } }) => {
  async function useSendEmail() {
    const email = await pipe(
      db.select().from(EmailPool).limit(1),
      AsyncSelectOneOrThrowError(0, InternalServerError),
    )
    return (req: Omit<SMTPRequest, keyof typeof email>) => pipe(
      JSON.stringify({ ...email, ...req }),
      (v): string => {
        encryptor.reset()
        return pipe(
          encryptor.finalize(v).toString(),
          crypto.enc.Utf8.parse,
          crypto.enc.Base64.stringify,
        )
      },
      body => () => fetch(config.SMTP_API_URL, {
        method: 'POST',
        body,
      }).then((d) => {
        if (!d.ok)
          throw InternalServerError
        return d
      }),
      RetryAsyncFunc(3),
    )
  }
  return next({
    ctx: {
      useSendEmail,
    },
  })
}) satisfies MiddlewareBuilder
