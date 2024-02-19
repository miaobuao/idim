import { type AppRouter } from '@idim/api';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

export default defineNuxtPlugin((app) => {
  const { API_HOST, API_PORT } = app.$config.public;

  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `http://${API_HOST}:${API_PORT}/trpc`,
        headers: () => {
          const token = useTokenStore();
          return {
            Authorization: `Bearer ${token.value}`,
          };
        },
      }),
    ],
  });
  return {
    provide: {
      trpc,
    },
  };
});
