import cors from '@fastify/cors';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

import { createContext } from './context';
import post from './modules/post';
import session from './modules/session';
import user from './modules/user';
import { t } from './trpc';
import config from './utils/config';
import { JwtPayload } from './utils/jwt';
import { logger } from './utils/logger';

export { JwtPayload };

const appRouter = t.mergeRouters(user, post, session);
export type AppRouter = typeof appRouter;

const server = fastify();
server.register(cors, {
  origin: '*',
});

const API_PORT = Number(config.API_PORT);

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
