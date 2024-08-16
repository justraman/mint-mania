import React, { Suspense } from "react";
import TradingViewChart from "./trading-view-chart";
import TradeBox from "./trade-box";
import Tokeninfo from "./token-info";
import { isHex } from "viem";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { TokenActivity } from "./token-activity";
import { TokenHolders } from "./token-holders";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Token({ params }: { params: { address: string } }) {
  const isAddress = isHex(params.address);
  const token = await db.query.tokens.findFirst({
    where: (token, { eq }) => (isAddress ? eq(token.address, params.address) : eq(token.id, params.address))
  });

  if (!token) {
    return notFound();
  }

  const allTrades = await db.query.trades.findMany({
    columns: {
      time: true,
      price: true
    },
    where: (trades, { eq }) => eq(trades.tokenId, token.id),
    orderBy: (trades, { asc }) => [asc(trades.time)],
    limit: 2000
  });

  const chartData = allTrades.map((trade) => ({ time: new Date(trade.time).getTime() / 1000, value: trade.price, label: trade.price / 1000_000 }));

  return (
    <section className="mx-auto container px-6 lg:px-8 mb-10 mt-10" id="services">
      {!token.confirmed && (
        <div className="text-yellow-400 animate-pulse text-lg font-serif mb-10">
          [This token is in the process of being indexed and may remain hidden from others until synchronization is finished, refresh the page to
          check again.]
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 place-content-center lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2 content-center">
          <Link href="/" className="flex gap-4 ml-2 group">
            <MoveLeft className="cursor-pointer transition-transform group-hover:-translate-x-2 mb-6" /> Home
          </Link>
          <div className="w-full border border-primary self-center border-solid  bg-black shadow-2xl relative">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%]  md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white" />
            <TradingViewChart data={chartData} />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <TradeBox token={token} />
          <Tokeninfo token={token} />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading...</div>}>
            <TokenActivity token={token} />
          </Suspense>
        </div>
        <div>
          <TokenHolders token={token} />
        </div>
      </div>
    </section>
  );
}
