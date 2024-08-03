// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Token.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";

contract MintMania is Ownable {
    constructor(address owner) Ownable(owner) {}

    event TokenCreated(address token, string name, string symbol);

    function createToken(string memory name, string memory symbol) public onlyOwner {
        // Create a new token with the specified name and symbol
        Token token = new Token(name, symbol);

        token.
        
        emit TokenCreated(address(token), name, symbol);
    }

}
