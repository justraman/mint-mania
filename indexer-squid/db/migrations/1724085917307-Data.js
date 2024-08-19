module.exports = class Data1724085917307 {
    name = 'Data1724085917307'

    async up(db) {
        await db.query(`ALTER TABLE "tokens" ALTER COLUMN "tx_hash" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "tokens" ALTER COLUMN "tx_hash" SET NOT NULL`)
    }
}
