import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Token } from "./model";
import { processor } from "./processor";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let tx of c.transactions) {
      // decode and normalize the tx data
      console.log(tx);
    }
  }
  // upsert batches of entities with batch-optimized ctx.store.save
});
