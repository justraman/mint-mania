"use client";

import React from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/lib/utils";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <button
        onClick={() =>
          open({
            view: "Account"
          })
        }
        className="group relative inline-block focus:outline-none focus:ring"
      >
        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

        <span className="relative inline-block border-2 border-primary px-8 py-3 text-lg font-bold uppercase tracking-widest text-green-950 group-active:text-opacity-75">
          {shortenAddress(address)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        open({
          view: "Connect"
        })
      }
      className="group relative inline-block focus:outline-none focus:ring"
    >
      <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

      <span className="relative inline-block border-2 border-primary px-8 py-3 text-lg font-bold uppercase tracking-widest text-green-950 group-active:text-opacity-75">
        Connect Wallet
      </span>
    </button>
  );
}
