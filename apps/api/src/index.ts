import cors from '@fastify/cors';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

import { createContext } from './context';
import user from './modules/user';
import { t } from './trpc';
import { logger } from './utils/logger';

const appRouter = t.mergeRouters(user);
export type AppRouter = typeof appRouter;

const server = fastify();
server.register(cors, {});

const API_PORT = Number(process.env.API_PORT ?? 8080);

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      logger.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

server.get('/hi', () => 'hi');
server
  .listen({
    port: API_PORT,
  })
  .then(() => {
    logger.info(`🔥Server listening on port: ${API_PORT}`);
  })
  .catch((err) => {
    logger.error('Server could not start 👾', err);
  });
