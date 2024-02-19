import db from '@repo/db';
import { TRPCError } from '@trpc/server';
import { compare as checkPwd } from 'bcrypt';
import z from 'zod';

import { protectedProcedure, publicProcedure, router } from '../trpc';
import { Token } from '../utils/jwt';
import { ZEmail, source } from '../utils/z';

export default router({
  session: {
    create: publicProcedure
      .input(
        z.object({
          email: ZEmail,
          password: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const user = await db.user.findUnique({
          where: {
            email: input.email,
          },
          select: {
            id: true,
            name: true,
            password: true,
          },
        });
        if (user === null || !(await checkPwd(input.password, user.password))) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: source.invalid_email_or_password,
          });
        }
        return {
          id: user.id,
          name: user.name,
          token: await Token.sign({ id: user.id }),
        };
      }),
    renew: protectedProcedure.mutation(({ ctx }) => {
      return Token.sign({ id: ctx.user.id });
    }),
    getUserInfo: protectedProcedure.query(({ ctx }) => {
      return {
        id: ctx.user.id,
        name: ctx.user.name,
      };
    }),
  },
});
