// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {MockERC20} from "forge-std/mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin-contracts-5.0.2/token/ERC20/IERC20.sol";
import {MintMania} from "../src/MintMania.sol";
import {Token} from "../src/Token.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";

contract MintManiaTest is Test {
    MintMania public mintMania;
    address alice = makeAddr("alice");

    function setUp() public {
        MockERC20 mockUSDT = new MockERC20();
        mockUSDT.initialize("Tether", "USDT", 6);
        mockUSDT.transfer(alice, 20000000000000000); // 2000 USDT
        mintMania = new MintMania(alice, address(mockUSDT));
    }

    function createToken() public returns (MintMania) {
        mintMania.create("Test", "TET", "https://test.com");
        return mintMania;
    }

    function test_createToken() public {
        vm.expectEmit(true, true, true, true);
        emit Ownable.OwnershipTransferred(address(0), address(mintMania));
        emit IERC20.Transfer(address(0), address(mintMania), 200_000_000);
        emit MintMania.TokenCreated(
            address(0x8d2C17FAd02B7bb64139109c6533b7C2b9CADb81),
            "Test",
            "TET"
        );

        mintMania.create("Test", "TET", "https://test.com");
        assertEq(mintMania.getTokens().length, 1);

        (
            string memory name,
            string memory symbol,
            string memory uri,
            bool launched
        ) = mintMania.getToken(
                address(0x8d2C17FAd02B7bb64139109c6533b7C2b9CADb81)
            );
        assertEq(name, "Test");
        assertEq(symbol, "TET");
        assertEq(uri, "https://test.com");
        assertFalse(launched);
    }

    function test_buyToken() public {
        vm.prank(alice);
        MintMania mania = createToken();
        mania.buy(address(0x8d2C17FAd02B7bb64139109c6533b7C2b9CADb81), 1_000_000);
    }
}
