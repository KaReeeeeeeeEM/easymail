ALTER TABLE "generated_report" ADD COLUMN IF NOT EXISTS "data" jsonb DEFAULT '[]'::jsonb NOT NULL;
