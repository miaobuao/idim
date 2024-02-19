import db from '@repo/db';
import * as bcrypt from 'bcrypt';
import z from 'zod';

import { procedure, router } from '../trpc';

export default router({
  user: {
    create: procedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation((opts) => {
        return bcrypt
          .hash(opts.input.password, 10)
          .then((password) => {
            return db.user.create({
              data: {
                ...opts.input,
                password: password,
              },
            });
          })
          .catch(() => {
            throw new Error('Failed to create user');
          });
      }),
  },
});
