import "./globals.css";
import React from "react";
import AppKitProvider from "./appkit-provider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "./wagmi-config";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Mint Mania",
  description: "Mint Mania"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AppKitProvider initialState={initialState}>
          <Header />
          <div className="md:px-20">{children}</div>
        </AppKitProvider>
        <Toaster />

        <Footer />
      </body>
    </html>
  );
}
