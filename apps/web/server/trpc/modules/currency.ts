import { Currency } from '@repo/db'
import { eq } from 'drizzle-orm'

import { protectedProcedure, router } from '../trpc'

export default router({
  currency: {
    query: protectedProcedure.query(async ({ ctx }) => {
      const currency = await ctx.db.select({
        soap: Currency.soap,
        pants: Currency.pants,
      }).from(Currency).where(
        eq(Currency.id, ctx.user.id),
      )
      return currency || { soap: 0, pants: 0 }
    }),
  },
})
