import type { AppRouter } from '~/server/trpc/router'

import { TRPCClientError } from '@trpc/client'
import { AxiosError } from 'axios'
import { isArray } from 'lodash-es'

import { pubMessage, pubNotify } from './pubsub'

type TRPCError = TRPCClientError<AppRouter>

export function errorHandler(err: AxiosError<string> | Error | TRPCError) {
  if (err instanceof AxiosError)
    axiosErrorHandler(err)
  else if (err instanceof TRPCClientError)
    trpcErrorHandler(err)
  else if (err instanceof Error)
    commonErrorHandler(err)
}

function axiosErrorHandler(err: AxiosError<string>) {
  const { $i18n } = useNuxtApp()
  const { t } = $i18n
  pubMessage({
    content: t(err.response?.data ?? 'error.unknown'),
    type: 'error',
  })
}

function commonErrorHandler(err: Error) {
  const app = useNuxtApp()
  const { t } = app.$i18n
  pubMessage({
    content: t(err.message),
    type: 'error',
  })
}

function trpcErrorHandler(err: TRPCError) {
  if (!err.message)
    throw err

  try {
    var msg = JSON.parse(err.message)
  }
  catch {
    if (isArray(msg))
      return msg.forEach(({ message }) => trpcErrorMessageHandler(message))
    return trpcErrorMessageHandler(msg)
  }
  throw err
}

export function trpcErrorMessageHandler(msg: string) {
  const app = useNuxtApp()
  const { t } = app.$i18n
  pubNotify({
    type: 'error',
    content: t(msg),
    duration: 5000,
  })
}
