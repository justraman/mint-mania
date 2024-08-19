import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Holders, Tokens, Trades, TradeSide } from "./model";
import { processor } from "./processor";
import { Contract, events } from "./abi/mint-mania";
import Pusher from "pusher";
import { assertNotNull } from "@subsquid/util-internal";

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
        console.log("TokenCreated", events.TokenCreated.decode(lg).name, lg.transaction);

        const contract = new Contract(ctx, lg.block, lg.address);
        const tokenBc = await contract.getToken(events.TokenSold.decode(lg).token);

        if (!tokenBc._2) {
          throw new Error("Token not found on blockchain");
        }
        // i know we shouldn't use image as id, but it's a hackathon project :)
        const token = await ctx.store.findOneByOrFail(Tokens, { image: tokenBc._2 });
        token.address = events.TokenCreated.decode(lg).token;
        token.txHash = lg.transaction!.hash;
        token.confirmed = true;
        await ctx.store.upsert(token);

        pusher.trigger(`token`, "created", {
          address: token.address
        });
      }

      if (events.TokenBought.is(lg)) {
        const [token, holder] = await await Promise.all([
          ctx.store.findOneByOrFail(Tokens, { address: events.TokenBought.decode(lg).token }),
          ctx.store.findOne(Holders, {
            where: { token: { address: events.TokenBought.decode(lg).token }, address: events.TokenBought.decode(lg).buyer }
          })
        ]);

        if (holder) {
          holder.balance += events.TokenBought.decode(lg).tokenAmount;
          await ctx.store.upsert(holder);
        } else {
          const holder = new Holders({
            address: events.TokenBought.decode(lg).buyer,
            balance: events.TokenBought.decode(lg).tokenAmount,
            token: token,
            id: `${token.address}_${events.TokenBought.decode(lg).buyer}`
          });
          await ctx.store.insert(holder);
        }

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

        pusher.trigger(`trades_${token.address}`, "new-trade", {
          price: trade.price,
          address: trade.address,
          time: trade.time,
          mc: mc.toString()
        });
      }

      if (events.TokenSold.is(lg)) {
        const [token, holder] = await Promise.all([
          ctx.store.findOneByOrFail(Tokens, { address: events.TokenSold.decode(lg).token }),
          ctx.store.findOneByOrFail(Holders, { token: { address: events.TokenSold.decode(lg).token }, address: events.TokenSold.decode(lg).seller })
        ]);

        holder.balance -= events.TokenSold.decode(lg).tokenAmount;
        if (holder.balance <= 0) {
          await ctx.store.remove(holder);
        } else {
          await ctx.store.upsert(holder);
        }

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

        pusher.trigger(`trades_${token.address}`, "new-trade", {
          price: trade.price,
          address: trade.address,
          time: trade.time,
          mc: mc.toString()
        });
      }
    }
  }
});
