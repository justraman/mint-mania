import * as React from 'react';
import CreateToken from "@/components/create-token";
import Search from "./_components/Search";
import Tokens from "./_components/Tokens";

export default function Home() {
  return (
    <div>
      <CreateToken />
      <Search />
      <Tokens />
    </div>
  );
}
