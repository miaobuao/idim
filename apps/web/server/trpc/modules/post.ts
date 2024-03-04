import z from 'zod'

import { publicProcedure, router } from '../trpc'

export default router({
  post: {
    create: publicProcedure.input(z.object({})).mutation(() => ''),
  },
})
