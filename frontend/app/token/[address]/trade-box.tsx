"use client";
import React, { useEffect, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Input } from "@/components/ui/input";
import { useAccount, useReadContract } from "wagmi";
import Erc20Abi from "@/abi/Erc20";
import type { tokens } from "@/db/schema";
import BigNumber from "bignumber.js";
import { contractAddresses, usdtContractAddress } from "@/constants";
import { formatUnits, parseUnits } from "viem";
import MintMania from "@/abi/MintMania";
import { readContract } from "@wagmi/core";
import { config } from "@/app/wagmi-config";
import debounce from "lodash/debounce";

function formatUSDT(value: bigint | undefined) {
  if (!value) return "0.0";
  return new BigNumber(value.toString()).shiftedBy(-6).toFixed(2);
}

export default function TradeBox({ token }: { token: typeof tokens.$inferSelect }) {
  const [selectedButton, setSelectedButton] = useState<"buy" | "sell">("buy");
  const { open } = useWeb3Modal();
  const account = useAccount();
  const [inputValue, setInputValue] = useState("");
  const [estimateTokenValue, setEstimateTokenValue] = useState<bigint | undefined>(undefined);
  const [estimateUsdtValue, setEstimateUsdtValue] = useState<bigint | undefined>(undefined);

  const usdtBalance = useReadContract({
    abi: Erc20Abi,
    address: usdtContractAddress,
    functionName: "balanceOf",
    args: [account.address ?? "0x"]
  });

  const calculateEstimated = async () => {
    if (!inputValue) return;
    if (!token.address) return;
    setEstimateTokenValue(undefined);
    setEstimateUsdtValue(undefined);
    try {
      if (selectedButton === "buy") {
        const value = parseUnits(inputValue, 6);
        const estimate = await readContract(config, {
          abi: MintMania.abi,
          address: contractAddresses,
          functionName: "calculateTokenReturn",
          args: [token.address as `0x${string}`, value]
        });
        setEstimateTokenValue(estimate);
      } else {
        const value = parseUnits(inputValue, 0);
        const estimate = await readContract(config, {
          abi: MintMania.abi,
          address: contractAddresses,
          functionName: "calculateSaleReturn",
          args: [token.address as `0x${string}`, value]
        });
        setEstimateUsdtValue(estimate);
      }
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(debounce(calculateEstimated), [inputValue]);

  const tokenBalance = useReadContract({
    abi: Erc20Abi,
    address: token.address as `0x${string}`,
    functionName: "balanceOf",
    args: [account.address ?? "0x"]
  });

  const setMax = () => {
    if (selectedButton === "buy" && usdtBalance.data) {
      setInputValue(formatUnits(usdtBalance.data, 6));
    }
  };

  return (
    <div className="w-full border border-solid border-primary bg-black shadow-2xl relative p-6">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white " />
      <div className="grid gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedButton("buy")}
            className={`p-3 border-[1px] ${
              selectedButton === "buy" ? "bg-primary text-green-900" : "text-primary"
            } w-full text-center text-2xl cursor-pointer hover:bg-primary hover:text-green-900 transition flex items-center justify-center`}
          >
            Buy
          </button>
          <button
            onClick={() => setSelectedButton("sell")}
            className={`p-3 border-[1px] ${
              selectedButton === "sell" ? "bg-red-500 text-white border-red" : "text-primary border-primary"
            } w-full text-center text-2xl cursor-pointer hover:bg-red-500 hover:text-white hover:border-white transition flex items-center justify-center`}
          >
            Sell
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex relative h-10 items-center">
              <button
                onClick={setMax}
                className="!absolute cursor-pointer right-1 top-1 z-10 select-none rounded bg-secondary py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:shadow-none active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:shadow-none"
                type="button"
                data-ripple-light="true"
              >
                max
              </button>
              <Input
                className="text-black font-bold peer h-full w-full rounded-[7px] border pr-20 font-sans text-sm  outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder="0.0"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                step="1"
              />
              <label className="pointer-events-none absolute right-28  flex w-auto  select-none text-lg pleading-tight text-black ">
                {selectedButton == "buy" ? "USDT" : "Token"}
              </label>
            </div>
            {estimateTokenValue && (
              <div className="text-md mt-1 ml-3 font-sans lowercase">
                {Intl.NumberFormat().format(estimateTokenValue)} <span className="">{token.symbol}</span>
              </div>
            )}
            {estimateUsdtValue && (
              <div className="text-md mt-1 ml-3 font-sans lowercase">
                {Intl.NumberFormat().format(Number(estimateUsdtValue) / 1000_000)} <span className="">USDT</span>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={token.confirmedByIndexer === false}
            className="p-3 disabled:bg-gray-300 disabled:border-none disabled:text-black border-[1px] border-primary text-primary w-full text-center text-2xl cursor-pointer hover:bg-primary hover:text-green-900 transition flex items-center justify-center"
          >
            {token.confirmedByIndexer === false ? "Token is being indexed..." : "Place Trade"}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>
              USDT Balance: <span className="text-xl ml-4">{formatUSDT(usdtBalance.data)} USDT</span>
            </span>

            <button
              onClick={() =>
                open({
                  view: "OnRampProviders"
                })
              }
              className="border px-2"
            >
              BUY USDT <span className="text-xl ml-1">+</span>
            </button>
          </div>
          <div className="flex items-center">
            Token Balance:{" "}
            <span className="text-xl ml-4">
              {tokenBalance.data ? formatUnits(tokenBalance.data, 0) : "0"} {token.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
