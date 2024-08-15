ALTER TABLE "tokens" ADD COLUMN "confirmed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "tx_hash" text;