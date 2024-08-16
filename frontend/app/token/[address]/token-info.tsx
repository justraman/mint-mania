"use client";
import { Progress } from "@/components/ui/progress";
import { tokens } from "@/db/schema";
import { Globe } from "lucide-react";
import React from "react";

export default function Tokeninfo({ token }: { token: typeof tokens.$inferSelect }) {
  console.log(`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${token.image}`);

  return (
    <div className="w-full border border-solid border-primary bg-black shadow-2xl relative p-6">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white " />
      <div className="grid gap-4">
        <div className="flex gap-4">
          <div className="grid w-full items-center gap-6 grid-cols-2">
            <div className="w-36 h-36 mx-auto">
              <img src={`https://mintmania.s3.us-east-1.amazonaws.com/tokens/${token.image}`} alt="token-image" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">
                <span className="w-12 break-all"> {token.name} </span> {"( "}
                <span className="text-primary">{token.symbol}</span>
                {" )"}
              </h1>
              <div className="grid grid-cols-4">
                {token.discord && (
                  <a href={token.discord} target="_blank">
                    <img className="w-6 invert fill-white" src="/icons/discord.svg" alt="discord" />
                  </a>
                )}
                {token.telegram && (
                  <a href={token.telegram} target="_blank">
                    <img className="w-6 invert fill-white" src="/icons/telegram.svg" alt="telegram" />
                  </a>
                )}
                {token.twitter && (
                  <a href={token.twitter} target="_blank">
                    <img className="w-6 invert fill-white" src="/icons/x.svg" alt="x" />
                  </a>
                )}
                {token.website && (
                  <a href={token.website} target="_blank">
                    <Globe className="w-6" size={24} />
                  </a>
                )}
              </div>
              <div className="mt-4">
                <p className="text-lg">Bonding Curve &nbsp; &nbsp; 33%</p>
                <span className="flex items-center gap-1">
                  0% <Progress className="h-2" value={33} /> 100%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
