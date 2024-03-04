import db from '@repo/db'

import { protectedProcedure, router } from '../trpc'

export default router({
  currency: {
    query: protectedProcedure.query(async ({ ctx }) => {
      const currency = await db.currency.findUnique({
        where: { userId: ctx.user.id },
        select: {
          soap: true,
          pants: true,
        },
      })
      return currency || { soap: 0, pants: 0 }
    }),
  },
})
