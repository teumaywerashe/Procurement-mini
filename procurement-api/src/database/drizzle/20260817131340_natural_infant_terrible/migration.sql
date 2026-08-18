CREATE TABLE "notification" (
	"id" serial PRIMARY KEY,
	"type" varchar NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"message" varchar NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
