import type { AppRouter } from '~/server/trpc/router'

import { TRPCClientError } from '@trpc/client'
import { AxiosError } from 'axios'
import { isArray } from 'lodash-es'

type TRPCError = TRPCClientError<AppRouter>
const publisher = createPubMessage({
  type: 'error',
  duration: 2500,
})

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
  publisher({
    content: t(err.response?.data ?? 'error.unknown'),
  })
}

function commonErrorHandler(err: Error) {
  const app = useNuxtApp()
  const { t } = app.$i18n
  publisher({
    content: t(err.message),
  })
}

function trpcErrorHandler(err: TRPCError) {
  if (!err.message)
    throw err
  try {
    var msg = JSON.parse(err.message)
  }
  catch {
    msg = err.message
  }
  if (isArray(msg))
    return msg.forEach(({ message }) => trpcErrorMessageHandler(message))
  return trpcErrorMessageHandler(msg)
}

export function trpcErrorMessageHandler(msg: string) {
  if (!msg)
    return
  const app = useNuxtApp()
  const { t } = app.$i18n
  publisher({
    content: t(msg),
  })
}
