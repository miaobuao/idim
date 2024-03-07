import { User } from '@repo/db'
import { buildLanguageSource } from '@repo/locales'
import { TRPCError } from '@trpc/server'
import z from 'zod'

import { publicProcedure, router } from '../trpc'
import { bcryptEncrypt } from '../utils/bcrypt'
import { ZEmail } from '../utils/z'

const source = buildLanguageSource()
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
      .mutation(async ({ input, ctx: { db } }) => {
        const password = await bcryptEncrypt(input.password)
        return db.insert(User).values({
          ...input,
          pwd: password,
        }).onConflictDoNothing().then((res) => {
          if (res.meta.changed_db)
            return true
          throw new TRPCError({
            code: 'CONFLICT',
            message: source.email_or_name_alreay_exists,
          })
        })
      }),
  },
})
