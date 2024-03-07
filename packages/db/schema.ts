import { sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const User = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  pwd: text('pwd').notNull(),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    emailIdx: index('user_email_idx').on(table.email),
  }
})

export const Currency = sqliteTable('currency', {
  id: integer('id').primaryKey().references(() => User.id),
  soap: integer('soap').notNull().default(0),
  pants: integer('pants').notNull().default(0),
})

export const RelativeAccount = sqliteTable('relative_account', {
  id: integer('id').primaryKey().references(() => User.id),
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
  id: integer('id').primaryKey({ autoIncrement: true }),
  authorId: integer('author_id').references(() => User.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  visible: integer('visible').notNull().default(1),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
  mtime: integer('mtime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    authorIdx: index('post_author_idx').on(table.authorId),
    ctimeIdx: index('post_ctime_idx').on(table.ctime),
    mtimeIdx: index('post_mtime_idx').on(table.mtime),
  }
})

export const PostComment = sqliteTable('bbs_post_comment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  authorId: integer('author_id').references(() => User.id),
  content: text('content').notNull(),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
  mtime: integer('mtime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    authorIdx: index('post_comment_author_idx').on(table.authorId),
    ctimeIdx: index('post_comment_ctime_idx').on(table.ctime),
    mtimeIdx: index('post_comment_mtime_idx').on(table.mtime),
  }
})

export const PostCommentLink = sqliteTable('bbs_post_comment_link', {
  id: integer('id').primaryKey().references(() => PostComment.id),
  postId: integer('post_id').references(() => Post.id),
  prevId: integer('prev_id').references(() => PostComment.id),
}, (table) => {
  return {
    postIdIdx: index('post_comment_link_post_id_idx').on(table.postId),
    prevCommentIdIdx: index('post_comment_link_prev_id_idx').on(table.prevId),
  }
})

export const PostLike = sqliteTable('bbs_post_like', {
  postId: integer('post_id').references(() => Post.id),
  userId: integer('user_id').references(() => User.id),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.postId, table.userId ] }),
  }
})

export const PostCommentLike = sqliteTable('bbs_post_comment_like', {
  commentId: integer('post_id').references(() => PostComment.id),
  userId: integer('user_id').references(() => User.id),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.commentId, table.userId ] }),
  }
})

export const forumDailyCheckinRecord = sqliteTable('bbs_daily_checkin_record', {
  userId: integer('user_id').references(() => User.id),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.userId, table.ctime ] }),
  }
})

export interface ForumBadgeMetadata {
  text: string
  color: string
}

export const forumUserBadge = sqliteTable('bbs_user_badge', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => User.id),
  metadata: text('metadata').$type<ForumBadgeMetadata>(),
}, (table) => {
  return {
    userIdx: index('forum_badge_user_id_idx').on(table.userId),
  }
})

export const EmailPool = sqliteTable('email_pool', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  password: text('password').notNull(),
  host: text('host').notNull(),
  port: integer('port').notNull(),
  from: text('from').notNull(),
})

export const ActivityThrowSoap = sqliteTable('activity_throw_soap', {
  userId: integer('user_id').references(() => User.id),
  count: integer('count').notNull(),
  ctime: integer('ctime').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    pk: primaryKey({ columns: [ table.userId, table.ctime ] }),
  }
})
