import { relations, sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  pwd: text('pwd').notNull(),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    emailIdx: index('user_email_idx').on(table.email),
  }
})

export const Currency = sqliteTable('currency', {
  id: integer('id').primaryKey().references(() => User.id, { onDelete: 'cascade' }).notNull(),
  soap: integer('soap').notNull().default(0),
  pants: integer('pants').notNull().default(0),
})

export const RelativeAccount = sqliteTable('relative_account', {
  id: integer('id').primaryKey().references(() => User.id, { onDelete: 'cascade' }).notNull(),
  qq: text('qq'),
  tel: text('tel'),
  xbox: text('xbox'),
}, (table) => {
  return {
    qqIdx: index('user_qq_idx').on(table.qq),
    telIdx: index('user_tel_idx').on(table.tel),
    xboxIdx: index('user_xbox_idx').on(table.xbox),
  }
})

export const Post = sqliteTable('bbs_post', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  authorId: integer('author_id').references(() => User.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
  mtime: integer('mtime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    authorIdx: index('post_author_idx').on(table.authorId),
    ctimeIdx: index('post_ctime_idx').on(table.ctime),
    mtimeIdx: index('post_mtime_idx').on(table.mtime),
  }
})

export const PostComment = sqliteTable('bbs_post_comment', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  authorId: integer('author_id').references(() => User.id).notNull(),
  content: text('content').notNull(),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
  mtime: integer('mtime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    authorIdx: index('post_comment_author_idx').on(table.authorId),
    ctimeIdx: index('post_comment_ctime_idx').on(table.ctime),
    mtimeIdx: index('post_comment_mtime_idx').on(table.mtime),
  }
})

export const PostCommentLink = sqliteTable('bbs_post_comment_link', {
  id: integer('id').primaryKey().references(() => PostComment.id).notNull(),
  postId: integer('post_id').references(() => Post.id).notNull(),
  prevId: integer('prev_id').references(() => PostComment.id).notNull(),
}, (table) => {
  return {
    postIdIdx: index('post_comment_link_post_id_idx').on(table.postId),
    prevCommentIdIdx: index('post_comment_link_prev_id_idx').on(table.prevId),
  }
})

export const PostLike = sqliteTable('bbs_post_like', {
  postId: integer('post_id').references(() => Post.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => User.id).notNull(),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.postId, table.userId ] }),
  }
})

export const PostCommentLike = sqliteTable('bbs_post_comment_like', {
  commentId: integer('post_id').references(() => PostComment.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => User.id).notNull(),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.commentId, table.userId ] }),
  }
})

export const ForumDailyCheckinRecord = sqliteTable('bbs_daily_checkin_record', {
  userId: integer('user_id').references(() => User.id).notNull(),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    userIdx: index('forum_daily_checkin_user_id_idx').on(table.userId),
    ctimeIdx: index('forum_daily_checkin_ctime_idx').on(table.ctime),
  }
})

export interface ForumBadgeMetadata {
  text: string
  color: string
}

export const ForumUserBadge = sqliteTable('bbs_user_badge', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  userId: integer('user_id').references(() => User.id, { onDelete: 'cascade' }).notNull(),
  metadata: text('metadata').$type<ForumBadgeMetadata>().notNull(),
}, (table) => {
  return {
    userIdx: index('forum_badge_user_id_idx').on(table.userId),
  }
})

export const EmailPool = sqliteTable('email_pool', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  host: text('host').notNull(),
  port: integer('port').notNull(),
  from: text('from').notNull(),
})

export const ActivityThrowSoap = sqliteTable('activity_throw_soap', {
  userId: integer('user_id').references(() => User.id, { onDelete: 'cascade' }).notNull(),
  count: integer('count').notNull(),
  ctime: integer('ctime', { mode: 'timestamp' }).default(sql`UNIXEPOCH()`).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.userId, table.ctime ] }),
  }
})

export const userRelations = relations(User, ({ many }) => ({
  posts: many(Post),
}))

export const postRelations = relations(Post, ({ one, many }) => ({
  author: one(User, {
    fields: [ Post.authorId ],
    references: [ User.id ],
  }),
  comments: many(PostCommentLink),
}))

export const postCommentLinkRelations = relations(PostCommentLink, ({ one }) => ({
  prevComment: one(PostComment, {
    fields: [ PostCommentLink.prevId ],
    references: [ PostComment.id ],
  }),
  post: one(Post, {
    fields: [ PostCommentLink.postId ],
    references: [ Post.id ],
  }),
}))

export const commentRelations = relations(PostComment, ({ one }) => ({
  author: one(User, {
    fields: [ PostComment.authorId ],
    references: [ User.id ],
  }),
}))
