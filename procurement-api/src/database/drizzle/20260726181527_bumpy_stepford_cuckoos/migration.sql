ALTER TABLE "tender" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "tender" ALTER COLUMN "status" DROP NOT NULL;