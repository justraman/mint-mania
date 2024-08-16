import assert from "assert";
import { 
  TestHelpers,
  MintMania_OwnershipTransferred
} from "generated";
const { MockDb, MintMania } = TestHelpers;

describe("MintMania contract OwnershipTransferred event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for MintMania contract OwnershipTransferred event
  const event = MintMania.OwnershipTransferred.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("MintMania_OwnershipTransferred is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await MintMania.OwnershipTransferred.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualMintManiaOwnershipTransferred = mockDbUpdated.entities.MintMania_OwnershipTransferred.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedMintManiaOwnershipTransferred: MintMania_OwnershipTransferred = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      previousOwner: event.params.previousOwner,
      newOwner: event.params.newOwner,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualMintManiaOwnershipTransferred, expectedMintManiaOwnershipTransferred, "Actual MintManiaOwnershipTransferred should be the same as the expectedMintManiaOwnershipTransferred");
  });
});
