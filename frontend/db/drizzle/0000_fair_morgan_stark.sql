DO $$ BEGIN
 CREATE TYPE "public"."tradeSide" AS ENUM('buy', 'sell');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "holders" (
	"token" text,
	"address" text NOT NULL,
	"balance" bigint NOT NULL,
	CONSTRAINT "holders_pk" PRIMARY KEY("token","address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text,
	"name" varchar(256) NOT NULL,
	"symbol" varchar(5) NOT NULL,
	"image" text,
	"twitter" text,
	"telegram" text,
	"discord" text,
	"website" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tokens_address_unique" UNIQUE("address"),
	CONSTRAINT "tokens_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text,
	"tx_hash" text NOT NULL,
	"amount" bigint NOT NULL,
	"price" integer NOT NULL,
	"side" "tradeSide" NOT NULL,
	"address" text,
	"time" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "holders" ADD CONSTRAINT "holders_token_tokens_address_fk" FOREIGN KEY ("token") REFERENCES "public"."tokens"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trades" ADD CONSTRAINT "trades_token_tokens_address_fk" FOREIGN KEY ("token") REFERENCES "public"."tokens"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
