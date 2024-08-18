import * as React from "react";
import CreateToken from "@/components/create-token";
import Tokens from "../components/Tokens";
import { db } from "@/db";
import TokenPodium from "@/components/TokenPodium";
import { AnyColumn } from "drizzle-orm";

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: { [key: string]: string } }) {
  const validSort = searchParams.sort && ["name:asc", "created_at:desc", "market_cap:desc"].includes(searchParams.sort);

  const [tokens, topTokens] = await Promise.all([
    db.query.tokens.findMany({
      where: (tokens, { isNotNull, and, ilike }) =>
        searchParams.q ? and(isNotNull(tokens.address), ilike(tokens.name, `%${searchParams.q}%`)) : isNotNull(tokens.address),
      orderBy: (tokens, { sql, desc }) => [
        validSort ? sql.raw(`${searchParams.sort.split(":")[0]} ${searchParams.sort.split(":")[1]}`) : desc(tokens.createdAt)
      ]
    }),
    db.query.tokens.findMany({
      where: (tokens, { isNotNull }) => isNotNull(tokens.address),
      orderBy: (tokens, { desc }) => [desc(tokens.marketCap)],
      limit: 3
    })
  ]);

  return (
    <div>
      <div className="flex flex-1 w-full flex-col gap-2 xl:gap-8 container lg:flex-row-reverse mt-8 mb-16 justify-center items-end ">
        <CreateToken />
        <TokenPodium tokens={topTokens} />
      </div>
      <Tokens tokens={tokens} />
    </div>
  );
}
