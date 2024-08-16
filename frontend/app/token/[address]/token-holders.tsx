import { db } from "@/db";
import type { tokens } from "@/db/schema";
import React from "react";

export async function TokenHolders({ token }: { token: typeof tokens.$inferSelect }) {
  const trades = await db.query.trades.findMany({
    where: (trades, { eq }) => eq(trades.tokenId, token.id),
    orderBy: (trades, { desc }) => [desc(trades.time)],
    limit: 10
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4">HODLERS</h1>

      {trades.map((trade) => (
        <div className="flex justify-between my-4 text-lg" key={trade.id}>
          <a href={`https://sepolia.basescan.org/tx/${trade.txHash}`}>{trade.address}</a>
          <span>123</span>
        </div>
      ))}
    </div>
  );
}
