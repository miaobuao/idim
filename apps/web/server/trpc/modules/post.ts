import { Post } from '@repo/db'
import { buildLanguageSource } from '@repo/locales'
import { and, count, eq } from 'drizzle-orm'
import { pipe } from 'fp-ts/lib/function'
import { z } from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'
import config from '../utils/config'
import { PostNotFoundError } from '../utils/errors'
import { GetCacheOrQuery, ThrowErrorIfPromiseNull } from '../utils/functions'
import { IntDto } from '../utils/z'

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

export const ListPostDto = z.object({
  limit: z.number().int().gt(0).lt(20),
  offset: z.number().int(),
})

export const ListCommentsDto = z.object({
  limit: z.number().int().gt(0).lt(20),
  offset: z.number().int(),
  postId: IntDto.gte(1),
})

export default router({
  post: {
    create: protectedProcedure.input(CreatePostDto).mutation(async ({ input, ctx: { db, kv, user } }) => {
      const res = db
        .insert(Post)
        .values({
          authorId: user.id,
          title: input.title,
          content: input.content,
        })
        .returning()
        .then(res => res[0])

      await pipe(
        () => db.select({ count: count() }).from(Post).then(res => res[0].count.toString()),
        GetCacheOrQuery(kv.cache, 'posts-count'),
        async count => await kv.cache.put('posts-count', (Number.parseInt(await count) + 1).toString()),
      )

      return res
    }),

    count: publicProcedure.query(({ ctx: { kv, db } }) => pipe(
      () => db.select({ count: count() }).from(Post).then(res => res[0].count.toString()),
      GetCacheOrQuery(kv.cache, 'posts-count'),
      async v => Number.parseInt(await v),
    )),

    get: publicProcedure.input(IntDto.gt(0)).query(({ ctx: { db }, input: id }) =>
      pipe(
        db.query.Post.findFirst({
          where: and(eq(Post.id, id), eq(Post.visible, true)),
          columns: {
            id: true,
            title: true,
            content: true,
            ctime: true,
            mtime: true,
          },
          with: {
            author: {
              columns: {
                id: true,
                username: true,
              },
            },
          },
        }),
        ThrowErrorIfPromiseNull(PostNotFoundError),
      ),
    ),

    getByOffset: publicProcedure.input(IntDto.gte(0)).query(({ ctx: { db }, input: offset }) =>
      pipe(
        db.query.Post.findFirst({
          offset,
          columns: {
            id: true,
            title: true,
            content: true,
            ctime: true,
            mtime: true,
          },
          with: {
            author: {
              columns: {
                id: true,
                username: true,
              },
            },
          },
        }),
        ThrowErrorIfPromiseNull(PostNotFoundError),
      ),
    ),
  },
})
