import type { AppRouter } from '@idim/api'

import { TRPCClientError } from '@trpc/client'
import { AxiosError } from 'axios'
import { isArray } from 'lodash-es'

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
  message({
    content: t(err.response?.data ?? 'error.unknown'),
    type: 'error',
  })
}

function commonErrorHandler(err: Error) {
  const app = useNuxtApp()
  const { t } = app.$i18n
  message({
    content: t(err.message),
    type: 'error',
  })
}

function trpcErrorHandler(err: TRPCError) {
  const app = useNuxtApp()
  const { t } = app.$i18n
  if (!err.message)
    throw err

  try {
    var msg = JSON.parse(err.message)
  }
  catch {
    return notify({
      content: t(err.message),
      duration: 5000,
    })
  }
  if (isArray(msg)) {
    return msg.forEach((cell) => {
      notify({
        content: t(cell.message),
        duration: 5000,
      })
    })
  }
  throw err
}
