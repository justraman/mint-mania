import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction
} from "@subsquid/evm-processor";
import { events } from "./abi/mint-mania";

export const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/base-sepolia")
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_ETH_HTTP, "No RPC endpoint supplied")
  })
  .setFinalityConfirmation(75)
  .setFields({
    log: {
      topics: true,
      data: true
    },
    transaction: {
      from: true,
      value: true,
      hash: true
    }
  })
  .setBlockRange({
    from: 14014260
  })
  .addLog({
    address: [process.env.CONTRACT_ADDRESS!],
    topic0: [events.TokenCreated.topic],
    transaction: true
  })
  .addLog({
    address: [process.env.CONTRACT_ADDRESS!],
    topic0: [events.TokenBought.topic],
    transaction: true
  })
  .addLog({
    address: [process.env.CONTRACT_ADDRESS!],
    transaction: true,
    topic0: [events.TokenSold.topic]
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
