// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {IERC20} from "@openzeppelin-contracts-5.0.2/token/ERC20/IERC20.sol";
import {MintMania} from "../src/MintMania.sol";
import {Token} from "../src/Token.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";

contract MockUSDT is ERC20 {
    constructor(address owner) ERC20("Tether", "USDT", 6) {
        _mint(owner, 1000_000_000);
    }
}

contract MintManiaTest is Test {
    MintMania public mintMania;
    MockUSDT public usdt;
    address alice = makeAddr("alice");

    function setUp() public {
        usdt = new MockUSDT(alice);
        mintMania = new MintMania(alice, address(usdt));
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

    function test_buySellToken() public {
        vm.startPrank(alice);
        address token = address(0x8d2C17FAd02B7bb64139109c6533b7C2b9CADb81);
        MintMania mania = createToken();

        // buy 1000 usdt worth of token
        assertEq(mania.getPrice(token), 14);
        usdt.approve(address(mania), 1000_000_000);
        mania.buy(token, 1000_000_000);
        assertEq(usdt.balanceOf(address(mania)), 1000_000_000);
        assertEq(usdt.balanceOf(alice), 0);
       
        assertEq(Token(token).balanceOf(alice), 54_912_125);
        assertEq(mania.getPrice(token), 22);

        // sell half tokens 54_912_125/2 = 27_456_062

        mania.sell(token, 27_456_062);
        assertEq(usdt.balanceOf(address(mania)), 444180558);
        assertEq(usdt.balanceOf(alice), 555_819442); // got my 555 usdt back
        assertEq(Token(token).balanceOf(alice), 27_456_063);
        assertEq(mania.getPrice(token), 18);

        mania.sell(token, 27_456_063);
        assertEq(usdt.balanceOf(address(mania)), 6);
        assertEq(usdt.balanceOf(alice), 999999994); //small overflow
        assertEq(Token(token).balanceOf(alice), 0);
        assertEq(mania.getPrice(token), 14); // price reset to initial
    }
}
