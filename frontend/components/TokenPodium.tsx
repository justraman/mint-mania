"use client";
import React from "react";
import Image from "next/image";
import type { tokens as Token } from "@/db/schema";
import RetroGrid from "@/components/magicui/retro-grid";

export default function TokenPodium({
  tokens,
}: {
  tokens: (typeof Token.$inferSelect)[];
}) {
  const sortedTokens = [...tokens]
    .sort((a, b) => Number(b.marketCap) - Number(a.marketCap))
    .slice(0, 3);

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
      <RetroGrid className="absolute inset-0 z-0" />

      <div className="flex flex-col items-center mb-16 z-10">
        <h2 className="font-bold text-4xl tracking-wide text-center mb-8">
          The <span className="text-primary">Top 3</span>
        </h2>

        <div className="flex justify-center items-end gap-4">
          {/* Second Place - Silver */}
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 bg-gray-300 flex items-center justify-center">
              <Image
                width={96}
                height={96}
                src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${sortedTokens[1].image}`}
                alt={sortedTokens[1].name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-center text-white mt-2">
              {sortedTokens[1].name}
            </h3>
            <p className="text-lg text-center text-gray-400">
              {sortedTokens[1].symbol}
            </p>
            <div className="bg-gray-400 w-20 h-16 mt-4 text-center">
              <p className="text-white font-bold">2</p>
            </div>
          </div>

          {/* First Place - Gold */}
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-300 flex items-center justify-center">
              <Image
                width={128}
                height={128}
                src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${sortedTokens[0].image}`}
                alt={sortedTokens[0].name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-center text-white mt-2">
              {sortedTokens[0].name}
            </h3>
            <p className="text-lg text-center text-gray-400">
              {sortedTokens[0].symbol}
            </p>
            <div className="bg-yellow-400 w-20 h-24 mt-4 text-center">
              <p className="text-white font-bold">1</p>
            </div>
          </div>

          {/* Third Place - Bronze */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-gray-300 flex items-center justify-center">
              <Image
                width={80}
                height={80}
                src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${sortedTokens[2].image}`}
                alt={sortedTokens[2].name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-center text-white mt-2">
              {sortedTokens[2].name}
            </h3>
            <p className="text-lg text-center text-gray-400">
              {sortedTokens[2].symbol}
            </p>
            <div className="bg-orange-800 w-20 h-12 mt-4 text-center">
              <p className="text-white font-bold">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
