DROP INDEX "smtp_configuration_organization_uq";--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN "smtp_configuration_id" uuid;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN "accepted_recipients" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN "rejected_recipients" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD COLUMN "provider_response" text;--> statement-breakpoint
ALTER TABLE "smtp_configuration" ADD COLUMN "label" text DEFAULT 'Primary sender' NOT NULL;--> statement-breakpoint
ALTER TABLE "smtp_configuration" ADD COLUMN "host" text DEFAULT 'smtp.gmail.com' NOT NULL;--> statement-breakpoint
ALTER TABLE "smtp_configuration" ADD COLUMN "port" integer DEFAULT 465 NOT NULL;--> statement-breakpoint
ALTER TABLE "smtp_configuration" ADD COLUMN "secure" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "smtp_configuration" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "smtp_configuration" ADD COLUMN "last_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_delivery" ADD CONSTRAINT "email_delivery_smtp_configuration_id_smtp_configuration_id_fk" FOREIGN KEY ("smtp_configuration_id") REFERENCES "public"."smtp_configuration"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "smtp_configuration_org_idx" ON "smtp_configuration" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "smtp_configuration_org_label_uq" ON "smtp_configuration" USING btree ("organization_id","label");