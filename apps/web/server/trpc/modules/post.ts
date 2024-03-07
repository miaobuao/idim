import { Post } from '@repo/db'
import { buildLanguageSource } from '@repo/locales'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'
import config from '../utils/config'

const source = buildLanguageSource()

export const CreatePostDto = z.object({
  title: z.string()
    .min(config.BBS.TITLE_MIN_LENGTH, source.titleMinLenError)
    .max(config.BBS.TITLE_MAX_LENGTH, source.titleMaxLenError),
  content: z.string()
    .min(config.BBS.CONTENT_MIN_LENGTH, source.contentMinLenError)
    .max(config.BBS.CONTENT_MAX_LENGTH, source.contentMaxLenError),
})

export type CreatePostType = z.infer<typeof CreatePostDto>

export default router({
  post: {
    create: protectedProcedure.input(CreatePostDto).mutation(({ input, ctx: { db, user } }) => {
      return db
        .insert(Post)
        .values({
          authorId: user.id,
          title: input.title,
          content: input.content,
        })
        .returning()
        .then(res => res[0])
    }),
  },
})
