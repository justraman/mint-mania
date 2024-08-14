"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TradeBox() {
    const [selectedButton, setSelectedButton] = useState("buy");

    return (
        <div className="w-full max-w-4xl border border-solid border-primary bg-black shadow-2xl relative p-6">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white " />
            <div className="grid">
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
                <div className="flex flex-col gap-4 mt-4">
                    <label className="block">
                        <Input
                            className="text-green-900 text-2xl p-4 h-16 appearance-none"
                            type="number"
                            placeholder="0.0"
                        />
                    </label>
                    <button
                        type="submit"
                        className="p-3 border-[1px] border-primary text-primary w-full text-center text-2xl cursor-pointer hover:bg-primary hover:text-green-900 transition flex items-center justify-center"
                    >
                        Place Trade
                    </button>
                </div>
            </div>
        </div>
    );
}
