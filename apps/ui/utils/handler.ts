import type { AppRouter } from '@idim/api';

import { TRPCClientError } from '@trpc/client';
import { AxiosError } from 'axios';
import { isArray } from 'lodash';

const { $i18n } = useNuxtApp();

type TRPCError = TRPCClientError<AppRouter>;

export function errorHandler(err: AxiosError<string> | Error | TRPCError) {
  if (err instanceof AxiosError) {
    axiosErrorHandler(err);
  } else if (err instanceof TRPCClientError) {
    trpcErrorHandler(err);
  } else if (err instanceof Error) {
    commonErrorHandler(err);
  }
}

function axiosErrorHandler(err: AxiosError<string>) {
  const app = useNuxtApp();
  const { t } = app.$i18n;
  message.error(t(err.response?.data ?? 'error.unknown'));
}

function commonErrorHandler(err: Error) {
  const app = useNuxtApp();
  const { t } = app.$i18n;
  message.error(t(err.message));
}

function trpcErrorHandler(err: TRPCError) {
  if (!err.message) {
    throw err;
  }
  const notify = new Notify({ duration: 5000 });
  try {
    var msg = JSON.parse(err.message);
  } catch {
    return notify.error($i18n.t(err.message));
  }
  if (isArray(msg)) {
    return msg.forEach((cell) => {
      notify.error($i18n.t(cell.message));
    });
  }
  throw err;
}
