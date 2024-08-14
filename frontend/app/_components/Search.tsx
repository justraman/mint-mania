"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

export default function Search() {
  return (
    <section
      className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 mb-10"
      id="services"
    >
      <div className="mb-10 items-center flex flex-col gap-2">
        <h2 className="font-bold text-4xl tracking-wide">
          Search <span className="text-primary">Token</span>{" "}
        </h2>
        <div className="flex w-full mt-3 max-w-sm items-center space-x-2">
          <Input
            className="text-green-900 text-xl"
            type="text"
            placeholder="Search..."
          />
          <Button type="submit" className="text-green-900 text-xl">
            <SearchIcon className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>
    </section>
  );
}
