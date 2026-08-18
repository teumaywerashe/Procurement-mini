ALTER TABLE "bid" ALTER COLUMN "amount" SET DATA TYPE numeric(12,2) USING "amount"::numeric(12,2);--> statement-breakpoint
DELETE FROM "notification" WHERE "bidId" IS NOT NULL AND "bidId" NOT IN (SELECT "id" FROM "bid");--> statement-breakpoint
DELETE FROM "notification" WHERE "tenderId" IS NOT NULL AND "tenderId" NOT IN (SELECT "id" FROM "tender");--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_tenderId_tender_id_fkey" FOREIGN KEY ("tenderId") REFERENCES "tender"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_bidId_bid_id_fkey" FOREIGN KEY ("bidId") REFERENCES "bid"("id") ON DELETE CASCADE;