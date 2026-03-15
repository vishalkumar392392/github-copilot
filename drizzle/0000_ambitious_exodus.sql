CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"original_url" text NOT NULL,
	"user_id" text NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "links_user_id_idx" ON "links" USING btree ("user_id");