import { bigint, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  address: text("address").unique(),
  name: varchar("name", { length: 256 }).notNull(),
  symbol: varchar("symbol", { length: 5 }).notNull().unique(),
  image: text("image"),
  twitter: text("twitter"),
  telegram: text("telegram"),
  discord: text("discord"),
  website: text("website")
});

export const tradeSide = pgEnum('tradeSide', ['buy', 'sell']);

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  token: text("token").references(() => tokens.address),
  amount: bigint("amount", { mode: "number" }).notNull(),
  price: integer("price").notNull(),
  side: tradeSide("side").notNull(),
  address: text("address"),
  date: timestamp('time').defaultNow(),
});
