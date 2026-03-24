CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(255) NOT NULL,
	"entity" varchar(255) NOT NULL,
	"entity_id" uuid NOT NULL,
	"performed_by" varchar(255) NOT NULL,
	"performed_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pdf_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"uploaded_by" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pdf_files" ADD CONSTRAINT "pdf_files_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;