"use client";
import React from "react";
import Image from "next/image";
import type { tokens as Token } from "@/db/schema";
import RetroGrid from "@/components/magicui/retro-grid";
import Link from "next/link";

export default function TokenPodium({ tokens }: { tokens: (typeof Token.$inferSelect)[] }) {
  if (tokens.length < 3) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent md:shadow-xl">
      <RetroGrid className="absolute inset-0 z-[-1]" />

      <div className="flex flex-col items-center z-10">
        <h2 className="font-bold text-4xl tracking-wide text-center mb-8">
          The <span className="text-primary">Top 3</span>
        </h2>

        <div className="flex justify-center h-full items-end gap-8">
          {/* Second Place - Silver */}
          <div className="flex flex-col items-center">
            <Link href={`/token/${tokens[1].address}`}>
              <div className="h-24 w-24  flex items-center justify-center">
                <Image
                  width={96}
                  height={96}
                  src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${tokens[1].image}`}
                  alt={tokens[1].name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>
            <h3 className="text-xl font-semibold text-center text-white mt-2">{tokens[1].symbol}</h3>
            <div className="bg-[#D3D3D3] relative flex items-center justify-center w-20 md:w-28 h-40 mt-4 text-center">
              <p className="text-black text-5xl font-bold">2</p>
            </div>
          </div>

          {/* First Place - Gold */}
          <div className="flex flex-col items-center">
            <Link href={`/token/${tokens[0].address}`}>
              <div className="h-24 w-24 flex items-center justify-center">
                <Image
                  width={128}
                  height={128}
                  src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${tokens[0].image}`}
                  alt={tokens[0].name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>
            <h3 className="text-xl font-semibold text-center text-white mt-2">{tokens[0].symbol}</h3>
            <div className="bg-[#FFD700] flex items-center justify-center transition-all w-20 md:w-28 h-56 mt-4 text-center">
              <p className="text-black text-5xl font-bold">1</p>
            </div>
          </div>

          {/* Third Place - Bronze */}
          <div className="flex flex-col items-center">
            <Link href={`/token/${tokens[2].address}`}>
              <div className="h-24 w-24 flex items-center justify-center">
                <Image
                  width={80}
                  height={80}
                  src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${tokens[2].image}`}
                  alt={tokens[2].name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>
            <h3 className="text-xl font-semibold text-center text-white mt-2">{tokens[2].symbol}</h3>
            <div className="bg-[#CD7F32] flex items-center justify-center w-20 md:w-28 h-28 mt-4 text-center">
              <p className="text-black text-5xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
