import { pgTable, serial, bigint, varchar, uniqueIndex, text, timestamp, boolean, numeric, index, foreignKey, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const migrations = pgTable("migrations", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint("timestamp", { mode: "number" }).notNull(),
	name: varchar("name").notNull(),
});

export const tokens = pgTable("tokens", {
	id: varchar("id").primaryKey().notNull(),
	address: text("address"),
	name: text("name").notNull(),
	symbol: text("symbol").notNull(),
	image: text("image"),
	twitter: text("twitter"),
	telegram: text("telegram"),
	discord: text("discord"),
	website: text("website"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	confirmed: boolean("confirmed").notNull(),
	txHash: text("tx_hash"),
	marketCap: numeric("market_cap").notNull(),
},
(table) => {
	return {
		idx8887C0Fb937Bc0E9Dc36Cb62F3: uniqueIndex("IDX_8887c0fb937bc0e9dc36cb62f3").using("btree", table.address),
	}
});

export const trades = pgTable("trades", {
	id: varchar("id").primaryKey().notNull(),
	txHash: text("tx_hash").notNull(),
	amount: numeric("amount").notNull(),
	price: integer("price").notNull(),
	side: varchar("side", { length: 4 }).notNull(),
	address: text("address"),
	time: timestamp("time", { withTimezone: true, mode: 'string' }).notNull(),
	tokenId: varchar("token_id").references(() => tokens.id),
},
(table) => {
	return {
		idxF3Fec09E67746A44A4022A722E: index("IDX_f3fec09e67746a44a4022a722e").using("btree", table.tokenId),
	}
});

export const holders = pgTable("holders", {
	id: varchar("id").primaryKey().notNull(),
	address: text("address").notNull(),
	balance: numeric("balance").notNull(),
	tokenId: varchar("token_id").references(() => tokens.id),
},
(table) => {
	return {
		idx754A197Feb4637B3Ac088859A8: index("IDX_754a197feb4637b3ac088859a8").using("btree", table.tokenId),
	}
});