import * as React from "react";
import CreateToken from "@/components/create-token";
import Tokens from "../components/Tokens";
import { db } from "@/db";

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: { [key: string]: string } }) {
  const tokens = await db.query.tokens.findMany({
    where: (tokens, { isNotNull, and, ilike }) =>
      searchParams.q ? and(isNotNull(tokens.address), ilike(tokens.name, `%${searchParams.q}%`)) : isNotNull(tokens.address)
  });

  return (
    <div>
      <CreateToken />
      <Tokens tokens={tokens} />
    </div>
  );
}
