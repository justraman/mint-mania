import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Tokens, Trades, TradeSide } from "./model";
import { processor } from "./processor";
import { Contract, events, functions } from "./abi/mint-mania";
import Pusher from "pusher";
import { assertNotNull } from "@subsquid/util-internal";
import { address } from "@subsquid/evm-codec";

const pusher = new Pusher({
  appId: "1850618",
  key: assertNotNull(process.env.PUSHER_KEY!, "No PUSHER key supplied"),
  secret: assertNotNull(process.env.PUSHER_SECRET!, "No PUSHER secret supplied"),
  cluster: "mt1",
  useTLS: true
});

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let lg of c.logs) {
      // decode and normalize the tx data
      if (events.TokenCreated.is(lg)) {
        const token = await ctx.store.findOneByOrFail(Tokens, { txHash: lg.transaction!.hash });
        token.address = events.TokenCreated.decode(lg).token;
        token.confirmed = true;
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

        const contract = new Contract(ctx, lg.block, lg.address);
        const mc = await contract.getMarketCap(events.TokenBought.decode(lg).token);

        token.marketCap = mc;
        await ctx.store.upsert(token);


        if (ctx.isHead) {
          pusher.trigger("trades", "new-trade", {
            price: trade.price,
            address: trade.address,
            time: trade.time
          });
        }
      }

      if (events.TokenSold.is(lg)) {
        const token = await ctx.store.findOneByOrFail(Tokens, { address: events.TokenSold.decode(lg).token });
        const trade = new Trades({
          address: events.TokenSold.decode(lg).seller,
          amount: events.TokenSold.decode(lg).amount,
          price: Number(events.TokenSold.decode(lg).price),
          time: new Date(lg.block.timestamp),
          side: TradeSide.SELL,
          token: token,
          txHash: lg.transaction!.hash,
          id: lg.id
        });
        await ctx.store.insert(trade);

        const contract = new Contract(ctx, lg.block, lg.address);
        const mc = await contract.getMarketCap(events.TokenSold.decode(lg).token);

        token.marketCap = mc;
        await ctx.store.upsert(token);

        if (ctx.isHead) {
          pusher.trigger("trades", "new-trade", {
            price: trade.price,
            address: trade.address,
            time: trade.time,
            mc: mc.toString()
          });
        }
      }
    }
  }
});
