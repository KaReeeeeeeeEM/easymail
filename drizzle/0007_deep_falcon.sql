ALTER TABLE "user" ADD COLUMN "accepted_terms" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "accepted_privacy" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "legal_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "legal_version" text;