"use client";

import React, { ReactNode } from "react";
import { config, projectId, metadata } from "./wagmi-config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State } from "wagmi";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  metadata,
  wagmiConfig: config,
  themeMode: 'dark',
  enableSwaps: false,
  projectId,
  allowUnsupportedChain: false,
  enableAnalytics: true,
  themeVariables: {
    '--w3m-color-mix': '#3e804f',
    '--w3m-color-mix-strength': 50,
    '--w3m-border-radius-master': '0'
  }
});

export default function AppKitProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
