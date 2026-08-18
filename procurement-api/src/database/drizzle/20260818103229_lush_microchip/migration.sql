CREATE TABLE "document" (
	"id" serial PRIMARY KEY,
	"file_name" varchar(255) NOT NULL,
	"object_key" varchar(512) NOT NULL UNIQUE,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"tender_id" integer,
	"bid_id" integer,
	"uploaded_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_tender_id_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_bid_id_bid_id_fkey" FOREIGN KEY ("bid_id") REFERENCES "bid"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_uploaded_by_users_id_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE CASCADE;