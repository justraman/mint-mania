import { relations } from "drizzle-orm/relations";
import { tokens, trades, holders } from "./schema";

export const tradesRelations = relations(trades, ({one}) => ({
	token: one(tokens, {
		fields: [trades.tokenId],
		references: [tokens.id]
	}),
}));

export const tokensRelations = relations(tokens, ({many}) => ({
	trades: many(trades),
	holders: many(holders),
}));

export const holdersRelations = relations(holders, ({one}) => ({
	token: one(tokens, {
		fields: [holders.tokenId],
		references: [tokens.id]
	}),
}));