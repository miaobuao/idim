CREATE TABLE `activity_throw_soap` (
	`user_id` integer NOT NULL,
	`count` integer NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`ctime`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `currency` (
	`id` integer PRIMARY KEY NOT NULL,
	`soap` integer DEFAULT 0 NOT NULL,
	`pants` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_pool` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`host` text NOT NULL,
	`port` integer NOT NULL,
	`from` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bbs_daily_checkin_record` (
	`user_id` integer NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`ctime`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bbs_user_badge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`metadata` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bbs_post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`visible` integer DEFAULT 1 NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`mtime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bbs_post_comment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer NOT NULL,
	`content` text NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`mtime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bbs_post_comment_like` (
	`post_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`post_id`, `user_id`),
	FOREIGN KEY (`post_id`) REFERENCES `bbs_post_comment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bbs_post_comment_link` (
	`id` integer PRIMARY KEY NOT NULL,
	`post_id` integer NOT NULL,
	`prev_id` integer NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `bbs_post_comment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `bbs_post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prev_id`) REFERENCES `bbs_post_comment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bbs_post_like` (
	`post_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`post_id`, `user_id`),
	FOREIGN KEY (`post_id`) REFERENCES `bbs_post`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `relative_account` (
	`id` integer PRIMARY KEY NOT NULL,
	`qq` text,
	`tel` text,
	`xbox` text,
	FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`pwd` text NOT NULL,
	`ctime` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `forum_badge_user_id_idx` ON `bbs_user_badge` (`user_id`);--> statement-breakpoint
CREATE INDEX `post_author_idx` ON `bbs_post` (`author_id`);--> statement-breakpoint
CREATE INDEX `post_ctime_idx` ON `bbs_post` (`ctime`);--> statement-breakpoint
CREATE INDEX `post_mtime_idx` ON `bbs_post` (`mtime`);--> statement-breakpoint
CREATE INDEX `post_comment_author_idx` ON `bbs_post_comment` (`author_id`);--> statement-breakpoint
CREATE INDEX `post_comment_ctime_idx` ON `bbs_post_comment` (`ctime`);--> statement-breakpoint
CREATE INDEX `post_comment_mtime_idx` ON `bbs_post_comment` (`mtime`);--> statement-breakpoint
CREATE INDEX `post_comment_link_post_id_idx` ON `bbs_post_comment_link` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_comment_link_prev_id_idx` ON `bbs_post_comment_link` (`prev_id`);--> statement-breakpoint
CREATE INDEX `user_qq_idx` ON `relative_account` (`qq`);--> statement-breakpoint
CREATE INDEX `user_tel_idx` ON `relative_account` (`tel`);--> statement-breakpoint
CREATE INDEX `user_xbox_idx` ON `relative_account` (`xbox`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `user` (`email`);