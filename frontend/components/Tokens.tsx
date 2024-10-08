"use client";

import Link from "next/link";
import React, { useState } from "react";
import Search from "./Search";
import Image from "next/image";
import type { tokens as Token } from "@/db/drizzle/schema";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Tokens({ tokens }: { tokens: (typeof Token.$inferSelect)[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const query = searchParams.get("q");
  const [sortCriteria, setSortCriteria] = useState(sort ? sort : "created_at:desc");

  const onQuery = (_query: string) => {
    if (!_query) {
      return router.push("/", {
        scroll: false
      });
    }
    router.push(`/?q=${_query}`, {
      scroll: false
    });
  };

  const onSort = (column: string) => {
    setSortCriteria(column);
    router.refresh();
    if (column === "created_at:desc") {
      if (query) {
        return router.push(`/?q=${query}`, {
          scroll: false
        });
      }
      return router.push(`/`, {
        scroll: false
      });
    }
    if (query) {
      return router.push(`/?q=${query}&sort=${column}`, {
        scroll: false
      });
    }
    return router.push(`/?sort=${column}`, {
      scroll: false
    });
  };

  if (tokens.length === 0 && query) {
    return (
      <>
        <Search onQuery={onQuery} query={query} />
        <section className="mx-auto text-center max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-10" id="services">
          <div className="">
            <h1 className="text-4xl font-bold text-center text-white">No tokens found for this query: {query}</h1>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Search onQuery={onQuery} query={query} />
      <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex justify-start mb-4">
          <select className="bg-black text-white p-3" value={sortCriteria} onChange={(e) => onSort(e.target.value)}>
            <option value="name:asc">A-Z</option>
            <option value="created_at:desc">Recent</option>
            <option value="market_cap:desc">Market Cap</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4 justify-items-center">
          {tokens.map((token) => (
            <Link href={`/token/${token.address}`} key={token.id}>
              <article
                key={token.id}
                className="hover:animate-background max-w-full bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] flex justify-center"
              >
                <div className="bg-black p-4 w-full max-w-full">
                  <div className="w-36 h-36 bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                    <Image
                      width={144}
                      height={144}
                      src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${token.image}`}
                      alt={token.name}
                      className="w-full h-full hover:scale-110 transition-transform duration-200 object-cover"
                    />
                  </div>
                  <h3 className="mt-0.5 text-2xl font-medium text-white text-center break-words">{token.name}</h3>
                  <h3 className="mt-0.5 text-2xl font-medium text-blue-500 text-center break-words">{token.symbol}</h3>
                  <h3 className="mt-0.5 text-2xl font-medium text-green-500 text-center">
                    {" "}
                    {(Number(token.marketCap) / 1e6).toFixed(1)}
                    {" USDT"}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
