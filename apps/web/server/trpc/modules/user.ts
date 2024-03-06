import { User } from '@repo/db'
import z from 'zod'

import { publicProcedure, router } from '../trpc'
import { bcryptEncrypt } from '../utils/bcrypt'
import { logger } from '../utils/logger'
import { ZEmail } from '../utils/z'

export default router({
  user: {
    create: publicProcedure
      .input(
        z.object({
          username: z.string(),
          email: ZEmail,
          password: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const password = await bcryptEncrypt(input.password)
        return ctx.db.insert(User).values({
          ...input,
          pwd: password,
        }).onConflictDoNothing().then((res) => {
          logger.info(res)
        })
        // .then(() => true)
        // .catch((err) => {
        //   if (err.code === 'P2002') {
        //     const field = err.meta.target[0] as string
        //     throw new TRPCError({
        //       code: 'CONFLICT',
        //       message: `${field}_already_exists`,
        //     })
        //   }
        //   throw new TRPCError({
        //     code: 'INTERNAL_SERVER_ERROR',
        //     message: source.internal_server_error,
        //   })
        // })
      }),
  },
})
