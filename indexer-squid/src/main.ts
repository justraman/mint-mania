import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Tokens, Trades, TradeSide } from "./model";
import { processor } from "./processor";
import { events } from "./abi/mint-mania";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let lg of c.logs) {
      console.log(lg);
      // decode and normalize the tx data
      if (events.TokenCreated.is(lg)) {
        const token = await ctx.store.findOneByOrFail(Tokens, { txHash: lg.transaction!.hash });
        token.address = events.TokenCreated.decode(lg).token;
        await ctx.store.upsert(token);
      }

      if (events.TokenBought.is(lg)) {
        const token = await ctx.store.findOneByOrFail(Tokens, { address: events.TokenBought.decode(lg).token });
        const trade = new Trades({
          address: events.TokenBought.decode(lg).buyer,
          amount: events.TokenBought.decode(lg).amount,
          price: Number(events.TokenBought.decode(lg).price),
          time: new Date(lg.block.timestamp),
          side: TradeSide.BUY,
          token: token,
          txHash: lg.transaction!.hash,
          id: lg.id
        });
        await ctx.store.insert(trade);
      }

      if (events.TokenSold.is(lg)) {
        const token = await ctx.store.findOneByOrFail(Tokens, { address: events.TokenBought.decode(lg).token });
        const trade = new Trades({
          address: events.TokenBought.decode(lg).buyer,
          amount: events.TokenBought.decode(lg).amount,
          price: Number(events.TokenBought.decode(lg).price),
          time: new Date(lg.block.timestamp),
          side: TradeSide.SELL,
          token: token,
          txHash: lg.transaction!.hash,
          id: lg.id
        });
        await ctx.store.insert(trade);
      }
    }
  }
  // upsert batches of entities with batch-optimized ctx.store.save
});
