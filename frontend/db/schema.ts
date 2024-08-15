import { bigint, boolean, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  address: text("address").unique(),
  name: varchar("name", { length: 256 }).notNull(),
  symbol: varchar("symbol", { length: 5 }).notNull().unique(),
  image: text("image"),
  twitter: text("twitter"),
  telegram: text("telegram"),
  discord: text("discord"),
  website: text("website"),
  confirmedByIndexer: boolean("confirmed").default(false),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow()
});

export const tradeSide = pgEnum("tradeSide", ["buy", "sell"]);

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  token: text("token").references(() => tokens.address),
  txHash: text("tx_hash").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  price: integer("price").notNull(),
  side: tradeSide("side").notNull(),
  address: text("address"),
  date: timestamp("time").defaultNow()
});

export const holders = pgTable(
  "holders",
  {
    token: text("token").references(() => tokens.address),
    address: text("address").notNull(),
    balance: bigint("balance", { mode: "number" }).notNull()
  },
  (table) => {
    return {
      holders_pk: primaryKey({ name: "holders_pk", columns: [table.token, tokens.address] })
    };
  }
);
