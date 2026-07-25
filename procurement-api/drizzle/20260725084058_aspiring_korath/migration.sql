CREATE TABLE "bid" (
	"id" serial PRIMARY KEY,
	"vendor_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) UNIQUE,
	"registration_number" varchar(255) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_vendor_id_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id");