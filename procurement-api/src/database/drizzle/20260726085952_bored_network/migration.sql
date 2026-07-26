ALTER TABLE "users" DROP CONSTRAINT "users_vendor_id_vendor_id_fkey";--> statement-breakpoint
ALTER TABLE "vendor" ADD COLUMN "owner_id" integer;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "vendor_id";--> statement-breakpoint
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id");