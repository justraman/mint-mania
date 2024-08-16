"use client";
import Link from "next/link";
import React, { useState } from "react";
import ConnectButton from "./web3/connect-button";

export default function Header() {
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);

  const openHowItWorksModal = () => {
    setIsHowItWorksModalOpen(true);
  };

  const closeHowItWorksModal = () => {
    setIsHowItWorksModalOpen(false);
  };

  return (
    <>
      <header className="py-8 bg-secondary">
        <div className="mx-auto flex flex-col md:flex-row md:h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center text-primary" href="/">
            <img src="/mania-logo.png" alt="mint-mania-logo" className="w-16 md:w-24" />
            <span className="text-7xl ml-2">MINT MANIA</span>
          </Link>

          <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button onClick={openHowItWorksModal} className="group relative inline-block focus:outline-none focus:ring">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-primary transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

                <span className="relative inline-block border-2 border-white px-8 py-3 text-lg font-bold uppercase tracking-widest text-green-950 group-active:text-opacity-75">
                  How It Works
                </span>
              </button>

              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* How It Works Modal */}
      {isHowItWorksModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-4">
          <div className="w-full max-w-md flex flex-col items-center justify-center border border-solid border-primary bg-black p-6 gap-4 shadow-2xl relative">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] md:-right-2 md:w-[102%] xs:h-[102%] bg-white" />
            <h2 className="text-4xl font-bold mb-4 text-center">How It Works</h2>
            <div className="text-white h-96 overflow-auto scrollbar-hide text-2xl">
              <p>1. Provide your token's name, symbol, and any relevant social media links.</p>
              <p>2. Select an image or GIF for your token.</p>
              <p>3. Deploy your token on Base!</p>
              <p className="mt-2">
                After deployment, you'll be taken to your token's dedicated page, where you can track its chart and launch details. Share the page
                link to draw in buyers!
              </p>
              <p className="mt-2">
                <p>
                  This contract uses a{" "}
                  <a className="text-blue-400" href="https://www.coinbase.com/learn/advanced-trading/what-is-a-bonding-curve" target="_blank">
                    bonding curve
                  </a>{" "}
                  , which means early buyers are incentivized by getting the token at a cheaper price.
                </p>
              </p>
            </div>
            <button
              onClick={closeHowItWorksModal}
              className="p-2 px-3 border-[1px] border-primary text-primary text-center mt-2 text-lg cursor-pointer hover:bg-primary hover:text-green-900"
            >
              Let's Go!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
