import { PostComment, PostCommentLink } from '@repo/db'
import { desc, eq } from 'drizzle-orm'
import { pipe } from 'fp-ts/lib/function'
import { z } from 'zod'

import { protectedProcedure, publicProcedure, router } from '../trpc'
import config from '../utils/config'
import { InternalServerError } from '../utils/errors'
import { SyncSelectOneOrThrowError } from '../utils/functions'
import { IntDto } from '../utils/z'

export default router({
  comment: {
    create: protectedProcedure.input(z.object({
      content: z.string().min(config.BBS.CONTENT_MIN_LENGTH).max(config.BBS.CONTENT_MAX_LENGTH),
      postId: IntDto.gte(1),
      prevId: IntDto.gte(1).optional(),
    })).mutation(async ({ input, ctx: { db, user } }) => pipe(
      await db.insert(PostComment).values({
        content: input.content,
        authorId: user.id,
      }).returning(),
      SyncSelectOneOrThrowError(0, InternalServerError),
      async comment => pipe(
        await db.insert(PostCommentLink).values({
          id: comment.id,
          postId: input.postId,
          prevId: input.prevId,
        }).returning(),
        SyncSelectOneOrThrowError(0, InternalServerError),
        () => comment,
      ),
    )),

    getAll: publicProcedure.input(z.object({
      postId: IntDto.gt(0),
    })).query(async ({ input, ctx: { db } }) => {
      return db.query.PostCommentLink.findMany({
        where: eq(PostCommentLink.postId, input.postId),
        columns: {
          prevId: true,
          id: true,
        },
        with: {
          comment: {
            columns: {
              id: true,
              content: true,
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
          },
        },
        orderBy: [ desc(PostCommentLink.id) ],
      })
    }),
  },

})
