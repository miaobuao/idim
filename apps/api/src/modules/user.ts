import db from '@repo/db';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import z from 'zod';

import { publicProcedure, router } from '../trpc';
import { ZEmail, source } from '../utils/z';

export default router({
  user: {
    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: ZEmail,
          password: z.string(),
        })
      )
      .mutation(async (opts) => {
        const password = await bcrypt.hash(opts.input.password, 10);
        return db.user
          .create({
            data: {
              ...opts.input,
              password,
              currency: {
                create: {
                  soap: 0,
                  pants: 0,
                },
              },
            },
          })
          .then(() => true)
          .catch((err) => {
            if (err.code === 'P2002') {
              const field = err.meta.target[0] as string;
              throw new TRPCError({
                code: 'CONFLICT',
                message: `${field}_already_exists`,
              });
            }
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: source.internal_server_error,
            });
          });
      }),
  },
});
