ALTER TABLE "email_delivery" ADD COLUMN IF NOT EXISTS "text_body" text;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN IF NOT EXISTS "html_body" text;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN IF NOT EXISTS "cc_recipients" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN IF NOT EXISTS "attachment_names" jsonb DEFAULT '[]'::jsonb NOT NULL;
