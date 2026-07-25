CREATE TABLE "bid" (
	"id" serial PRIMARY KEY,
	"vendor_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"tender_id" integer NOT NULL,
	"reference_number" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tender" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"status" varchar(255) DEFAULT 'Draft' NOT NULL,
	"title" varchar(255) NOT NULL,
	"closing_date" timestamp NOT NULL,
	"estimated_value" varchar(255) NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"role" varchar(255) DEFAULT 'Vendor' NOT NULL,
	"password" varchar(255) NOT NULL,
	"vendor_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) UNIQUE,
	"registration_number" varchar(255) NOT NULL UNIQUE,
	"phone_number" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_vendor_id_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id");--> statement-breakpoint
ALTER TABLE "bid" ADD CONSTRAINT "bid_tender_id_tender_id_fkey" FOREIGN KEY ("tender_id") REFERENCES "tender"("id");--> statement-breakpoint
ALTER TABLE "tender" ADD CONSTRAINT "tender_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_vendor_id_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id");