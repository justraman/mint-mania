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
        _mint(owner, 68070_000_000); // 100000 usdt
    }
}

contract MintManiaTest is Test {
    MintMania public mintMania;
    MockUSDT public usdt;
    address alice = makeAddr("alice");

    function setUp() public {
        usdt = new MockUSDT(alice);
        mintMania = new MintMania(alice, address(usdt), address(usdt));
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
        assertEq(mania.getPrice(token), 13);
        usdt.approve(address(mania), 1000_000_000);
        mania.buy(token, 1000_000_000);
        assertEq(usdt.balanceOf(address(mania)), 1000_000_000);
        assertEq(usdt.balanceOf(alice), 67070000000);

        assertEq(Token(token).balanceOf(alice), 60271979);
        assertEq(mania.getPrice(token), 20);

        // sell half tokens 60271979/2 = 30135989

        mania.sell(token, 30135989);
        assertEq(usdt.balanceOf(address(mania)), 446765882);
        assertEq(usdt.balanceOf(alice), 67623234118); // got my 553 usdt back
        assertEq(Token(token).balanceOf(alice), 30_135_990);
        assertEq(mania.getPrice(token), 16);

        mania.sell(token, 30135990);
        assertEq(usdt.balanceOf(address(mania)), 3);
        assertEq(usdt.balanceOf(alice), 68069999997); //small overflow
        assertEq(Token(token).balanceOf(alice), 0);
        assertEq(mania.getPrice(token), 13); // price reset to initial

        // buy a lot of tokens
        usdt.approve(address(mania), 68069999997);
        mania.buy(token, 68069999997);
        assertEq(usdt.balanceOf(address(mania)), 68070000000);
        assertEq(usdt.balanceOf(alice), 0);
        assertEq(Token(token).balanceOf(alice), 799992572); // almost 800 million
        assertEq(mania.getPrice(token), 181);

        mania.sell(token, 30_135_989);
        assertEq(usdt.balanceOf(address(mania)), 62726427110);
        assertEq(usdt.balanceOf(alice), 5343_572_890); // got my 553 usdt back
        assertEq(Token(token).balanceOf(alice), 769856583);
        assertEq(mania.getPrice(token), 172);

        mania.sell(token, 30_135_989);
        assertEq(usdt.balanceOf(address(mania)), 57646992942);
        assertEq(usdt.balanceOf(alice), 10423_007_058); // got my 553 usdt back
        assertEq(Token(token).balanceOf(alice), 739720594);
        assertEq(mania.getPrice(token), 164);
    }

    function test_calculateTokenReturn() public {
        vm.startPrank(alice);
        address token = address(0x8d2C17FAd02B7bb64139109c6533b7C2b9CADb81);
        MintMania mania = createToken();

        uint256 tokens = mania.calculateTokenReturn(token, 1000_000_000);

        assertEq(tokens, 60271979);
    }
}
