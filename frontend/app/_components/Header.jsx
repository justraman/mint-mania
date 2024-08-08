"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="py-16 bg-secondary">
        <div className="mx-auto flex flex-col md:flex-row md:h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center text-primary" href="/">
            <img
              src="./mint-logo.png"
              alt="mint-mania-logo"
              className="w-16 md:w-24"
            />
            <span className="text-7xl ml-2">MINT MANIA</span>
          </Link>

          <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button
                onClick={openModal}
                className="group relative inline-block focus:outline-none focus:ring"
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-primary transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

                <span className="relative inline-block border-2 border-white px-8 py-3 text-lg font-bold uppercase tracking-widest text-green-950 group-active:text-opacity-75">
                  How It Works
                </span>
              </button>

              <Link
                className="group relative inline-block focus:outline-none focus:ring"
                href="/"
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

                <span className="relative inline-block border-2 border-primary px-8 py-3 text-lg font-bold uppercase tracking-widest text-green-950 group-active:text-opacity-75">
                  Connect Wallet
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md flex flex-col items-center justify-center border border-solid border-primary bg-black p-6 gap-4 shadow-2xl relative">
            <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] md:-right-2 md:w-[102%] xs:h-[102%] bg-white" />
            <h2 className="text-4xl font-bold mb-4 text-center">How It Works</h2>
            <div className="text-white text-2xl">
              <p>1. Enter your token's name and symbol, along with any social media links.</p>
              <p>2. Choose an image or GIF for your token.</p>
              <p>3. [Optional] Decide how much ETH you'd like to buy of your token upfront.</p>
              <p>4. Deploy your token on Base!</p>
              <p className="mt-2">
                After deploying, you'll be brought to your token's unique page where you'll see its chart and other launch stats. Share your token's page link to get buyers!
              </p>
              <p className="mt-2">
                Once a token is traded to a high enough market cap, all of its liquidity will automatically be deployed on Uniswap, the LP will be burned, and the contract will be renounced. Because of this, all LaunchOnBase tokens are 100% unruggable.
              </p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 px-3 border-[1px] border-primary
              text-primary  text-center
              mt-2
              text-lg
              cursor-pointer 
              hover:bg-primary hover:text-green-900"            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
