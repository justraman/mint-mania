// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Token.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";

struct TokenInfo {
    string name;
    string symbol;
    string uri;
}

contract MintMania is Ownable {
    uint256 public constant MAX_SUPPLY = 1000_000_000; // 1 billion
    uint256 public constant INITIAL_SUPPLY = 100_000_000; // 1 million (10% of max supply)

    mapping(address => TokenInfo) private tokens;
    mapping(address => mapping(address => uint256)) private balances;
    mapping(address => uint256) private tokenEthBalance;

    constructor(address owner) Ownable(owner) {}

    event TokenCreated(address token, string name, string symbol);
    event TokenBought(address token, address buyer, uint256 amount);

    function create(
        string memory name,
        string memory symbol,
        string memory uri
    ) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(uri).length > 0, "URI cannot be empty");

        Token token = new Token(name, symbol, INITIAL_SUPPLY, MAX_SUPPLY);
        tokens[address(token)] = TokenInfo(name, symbol, uri);
        emit TokenCreated(address(token), name, symbol);
    }

    // amount in token
    function buy(address token, uint256 amount) public payable {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(amount > 0, "Amount must be greater than 0");

        uint256 amountEth = getPricePerToken(token) * amount;
        require(msg.value >= amountEth, "Insufficient funds sent");

        balances[token][msg.sender] += amount;
        tokenEthBalance[token] += amountEth;

        emit TokenBought(token, msg.sender, amount);
    }

    function getPricePerToken(address token) public view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        // calculate price based on bonding curve

        return 1;

    }
}
