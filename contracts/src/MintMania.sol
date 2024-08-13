// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Token.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";
import "@openzeppelin-contracts-5.0.2/utils/Pausable.sol";
import "@openzeppelin-contracts-5.0.2/token/ERC20/IERC20.sol";

struct TokenInfo {
    string name;
    string symbol;
    string uri;
    bool launched;
}

contract MintMania is Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000_000_000; // 1 billion
    uint256 public constant INITIAL_SUPPLY = 200_000_000; // 20 million (20% of max supply)
    uint256 public constant INITAL_PRICE = 1;
    uint256 private constant MAGIC_NUMBER = 55825; // part per billion
    IERC20 public immutable stableToken;

    mapping(address => TokenInfo) private tokens;
    mapping(address => mapping(address => uint256)) private balances;
    mapping(address => uint256) private tokenEthBalance;

    constructor(address owner, address _usdt) Ownable(owner) {
        stableToken = IERC20(_usdt);
    }

    event TokenCreated(address token, string name, string symbol);
    event TokenBought(address token, address buyer, uint256 amount);
    event TokenSold(address token, address seller, uint256 amount);

    function create(
        string memory name,
        string memory symbol,
        string memory uri
    ) external whenNotPaused {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(uri).length > 0, "URI cannot be empty");

        Token token = new Token(name, symbol, INITIAL_SUPPLY, MAX_SUPPLY);
        tokens[address(token)] = TokenInfo(name, symbol, uri, false);
        emit TokenCreated(address(token), name, symbol);
    }

    // amount in token
   /*  function buy(address token, uint256 amount) external payable whenNotPaused {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(tokens[token].launched == false, "Token is launched on DEX");
        require(amount > 0, "Amount must be greater than 0");

        uint256 amountEth = getPricePerToken(token) * amount;
        require(msg.value >= amountEth, "Insufficient funds sent");

        balances[token][msg.sender] += amount;
        tokenEthBalance[token] += amountEth;

        emit TokenBought(token, msg.sender, amount);
    } */
/* 
    function sell(address token, uint256 amount) external whenNotPaused {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(tokens[token].launched == false, "Token is launched on DEX");
        require(amount > 0, "Amount must be greater than 0");

        require(balances[token][msg.sender] >= amount, "Insufficient balance");

        uint256 amountEth = getPricePerToken(token) * amount;
        balances[token][msg.sender] -= amount;
        tokenEthBalance[token] -= amountEth;

        payable(msg.sender).transfer(amountEth);

        emit TokenSold(token, msg.sender, amount);
    } */

    /* function getPrice(address token, uint256 amount) external view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(amount > 0, "Amount must be greater than 0");

        uint256 totalSupply = Token(token).totalSupply() - INITIAL_SUPPLY;
        uint256 newSupply = totalSupply + amount;
        uint256 oldPrice = getPriceAtSupply(totalSupply);
        uint256 newPrice = getPriceAtSupply(newSupply);

        return 1;
    } */


    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
