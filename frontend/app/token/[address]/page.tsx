"use client";
import React from "react";
import TradingViewChart from "../TradingViewChart";
import TradeBox from "../TradeBox";

function TokenDetail({ params }: { params: { address: string } }) {
  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-10" id="services">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className=" lg:col-span-2">
          <div className="w-full border border-solid border-primary bg-black   shadow-2xl relative">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%]  md:-right-3 md:w-[102%] xs:h-[102%] lg:-right-4 bg-white" />
            <TradingViewChart className="w-full" symbol="ETHUSD" />
          </div>
        </div>
        <div>
          <TradeBox />
        </div>
      </div>
    </section>
  );
}

export default TokenDetail;
