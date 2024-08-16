import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/db";
import type { tokens } from "@/db/schema";
import { shortenAddress } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export async function TokenActivity({ token }: { token: typeof tokens.$inferSelect }) {
  const trades = await db.query.trades.findMany({
    where: (trades, { eq }) => eq(trades.tokenId, token.id),
    orderBy: (trades, { desc }) => [desc(trades.time)],
    limit: 10
  });

  if (trades.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl">Recent Token Activity</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Action</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell className="font-medium">{trade.side}</TableCell>
              <TableCell>{shortenAddress(trade.address!)}</TableCell>
              <TableCell>${(trade.amount / 1000000).toFixed(6)}</TableCell>
              <TableCell>{trade.time}</TableCell>
              <TableCell className="text-right">
                <a href={`https://sepolia.basescan.org/tx/${trade.txHash}`} className="flex gap-4 justify-end cursor-pointer items-center">
                  {shortenAddress(trade.txHash)} <ExternalLink size={12}></ExternalLink>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Current Price</TableCell>
            <TableCell className="text-right text-xl">${(trades[0].price / 1000000).toFixed(6)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
