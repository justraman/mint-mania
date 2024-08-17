// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console } from "forge-std/Test.sol";
import {BancorBondingCurve} from "../src/BondingCurve.sol";

contract BondingCurve is Test {
    BancorBondingCurve public banchor;

    function setUp() public {
        banchor = new BancorBondingCurve();
    }

    function test_calculatePurchaseReturn() public view {
        // buy from 1 usdt  will give initial = 109975 tokens
        uint256 amountToken = banchor.calculatePurchaseReturn(
            200_000_000,
            1000_000_000,
            550000,
            1_000_000
        );

        uint256 amountToken2 = banchor.calculatePurchaseReturn(
            200_000_000,
            1000_000_000,
            550000,
            2_000_000
        );

        assertEq(amountToken, 109975);
        assertEq(amountToken2, 219901);
    }

    function test_calculateSaleReturn() public view {
        // sell 109975 tokens will give 1 usdt
        uint256 amountToken = banchor.calculateSaleReturn(
            200_109_975,
            1001_000_000,
            550000,
            109975
        );

        uint256 amountToken2 = banchor.calculateSaleReturn(
            200_219_901,
            1002_000_000,
            550000,
            219901
        );

        // it should always be ceil
        assertEq(amountToken, 999997);
        assertEq(amountToken2, 1999999);
    }

    
}
