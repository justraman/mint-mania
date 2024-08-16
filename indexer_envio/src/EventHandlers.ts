/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  MintMania,
  MintMania_TokenBought,
  MintMania_TokenCreated,
  MintMania_TokenSold,
} from "generated";


MintMania.TokenBought.handler(async ({ event, context }) => {
  const entity: MintMania_TokenBought = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token: event.params.token,
    buyer: event.params.buyer,
    amount: event.params.amount,
    price: event.params.price,
  };

  context.MintMania_TokenBought.set(entity);
});


MintMania.TokenCreated.handler(async ({ event, context }) => {
  const entity: MintMania_TokenCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token: event.params.token,
    name: event.params.name,
    symbol: event.params.symbol,
  };

  context.MintMania_TokenCreated.set(entity);
});


MintMania.TokenSold.handler(async ({ event, context }) => {
  const entity: MintMania_TokenSold = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    token: event.params.token,
    seller: event.params.seller,
    amount: event.params.amount,
    price: event.params.price,
  };

  context.MintMania_TokenSold.set(entity);
});


