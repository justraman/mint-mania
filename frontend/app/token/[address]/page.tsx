import React from "react";
import TradingViewChart from "./trading-view-chart";
import TradeBox from "./trade-box";
import { eq } from "drizzle-orm";
import Tokeninfo from "./token-info";
import { isHex } from "viem";
import { db } from "@/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Token({ params }: { params: { address: string } }) {
  const isAddress = isHex(params.address);
  const token = await db.query.tokens.findFirst({
    where: (token, { eq }) => (isAddress ? eq(token.address, params.address) : eq(token.id, parseInt(params.address)))
  });

  if (!token) {
    return notFound();
  }

  return (
    <section className="mx-auto container px-6 lg:px-8 mb-10 mt-10" id="services">
      {!token.confirmedByIndexer && (
        <div className="text-yellow-400 animate-pulse text-lg font-serif mb-10">
          [This token is in the process of being indexed and may remain hidden from others until synchronization is finished, refresh the page to
          check again.]
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2">
          <div className="w-full border border-solid border-primary bg-black   shadow-2xl relative">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%]  md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white" />
            <TradingViewChart symbol="ETHUSD" />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <TradeBox token={token} />
          <Tokeninfo token={token} />
        </div>
      </div>
    </section>
  );
}
