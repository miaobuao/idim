CREATE TABLE `verify_code` (
	`type` text NOT NULL,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verify_code_type_idx` ON `verify_code` (`type`);--> statement-breakpoint
CREATE INDEX `verify_code_email_idx` ON `verify_code` (`email`);--> statement-breakpoint
CREATE INDEX `verify_code_expires_at_idx` ON `verify_code` (`expires_at`);