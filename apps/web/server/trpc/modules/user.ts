import { User } from '@repo/db'
import { z } from 'zod'

import { publicProcedure, router } from '../trpc'
import { bcryptEncrypt } from '../utils/bcrypt'
import { UserAlreadyExistsError } from '../utils/errors'
import { EmailDto } from '../utils/z'

export const CreateUserDto = z.object({
  username: z.string().min(2),
  email: EmailDto,
  password: z.string().min(10),
})

export type CreateUserType = z.infer<typeof CreateUserDto>

export default router({
  user: {
    create: publicProcedure
      .input(CreateUserDto)
      .mutation(async ({ input, ctx: { db } }) => {
        const password = await bcryptEncrypt(input.password)
        return db.insert(User).values({
          ...input,
          pwd: password,
        }).onConflictDoNothing().then((res) => {
          if (res.meta.changed_db)
            return true
          throw UserAlreadyExistsError
        })
      }),
  },
})
