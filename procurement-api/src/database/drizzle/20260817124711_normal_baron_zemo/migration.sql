CREATE TABLE "notification" (
	"id" serial PRIMARY KEY,
	"type" string NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"message" string NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
