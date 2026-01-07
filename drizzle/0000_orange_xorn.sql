CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"pain_points" text[] DEFAULT '{}' NOT NULL,
	"other_pain_point" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"invited_at" timestamp,
	"has_access" boolean DEFAULT false NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
