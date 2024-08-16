module.exports = class Data1723810052009 {
    name = 'Data1723810052009'

    async up(db) {
        await db.query(`CREATE TABLE "trades" ("id" character varying NOT NULL, "tx_hash" text NOT NULL, "amount" numeric NOT NULL, "price" integer NOT NULL, "side" character varying(4) NOT NULL, "address" text, "time" TIMESTAMP WITH TIME ZONE NOT NULL, "token_id" character varying, CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f3fec09e67746a44a4022a722e" ON "trades" ("token_id") `)
        await db.query(`CREATE TABLE "tokens" ("id" character varying NOT NULL, "address" text, "name" text NOT NULL, "symbol" text NOT NULL, "image" text, "twitter" text, "telegram" text, "discord" text, "website" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "confirmed" boolean NOT NULL, "tx_hash" text NOT NULL, "market_cap" numeric NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE UNIQUE INDEX "IDX_8887c0fb937bc0e9dc36cb62f3" ON "tokens" ("address") `)
        await db.query(`CREATE TABLE "holders" ("id" character varying NOT NULL, "address" text NOT NULL, "balance" numeric NOT NULL, "token_id" character varying, CONSTRAINT "PK_db78e78aa79aa06fd917151e37f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_754a197feb4637b3ac088859a8" ON "holders" ("token_id") `)
        await db.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_f3fec09e67746a44a4022a722ef" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "holders" ADD CONSTRAINT "FK_754a197feb4637b3ac088859a8b" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "trades"`)
        await db.query(`DROP INDEX "public"."IDX_f3fec09e67746a44a4022a722e"`)
        await db.query(`DROP TABLE "tokens"`)
        await db.query(`DROP INDEX "public"."IDX_8887c0fb937bc0e9dc36cb62f3"`)
        await db.query(`DROP TABLE "holders"`)
        await db.query(`DROP INDEX "public"."IDX_754a197feb4637b3ac088859a8"`)
        await db.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_f3fec09e67746a44a4022a722ef"`)
        await db.query(`ALTER TABLE "holders" DROP CONSTRAINT "FK_754a197feb4637b3ac088859a8b"`)
    }
}
