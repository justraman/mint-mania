// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {BancorBondingCurve} from "../src/BondingCurve.sol";

contract BondingCurve is Test {
    BancorBondingCurve public banchor;

    function setUp() public {
        banchor = new BancorBondingCurve();
    }

    function test_PurchaseToken() public {
       uint256 data = banchor.calculatePurchaseReturn(800_000_000, 69000_000_000, 300000, 26000);
       console.logUint(data);

    }

}

