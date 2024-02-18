import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

export const appRouter = t.router({
  hi: t.procedure.query(() => 'hi'),
});

export type AppRouter = typeof appRouter;
