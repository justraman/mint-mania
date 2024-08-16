// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Token.sol";
import "./BondingCurve.sol";
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
    uint256 public constant INITIAL_COLLATORAL = 1000_000_000; // 1k usdt
    uint32 private constant RR = 380020; // part per milliom

    IERC20 public immutable stableToken;
    BancorBondingCurve private immutable bondingCurve;

    mapping(address => TokenInfo) private tokens;
    mapping(address => mapping(address => uint256)) private balances;
    mapping(address => uint256) private tokenEthBalance;
    mapping(address => uint256) private usdtSuplly;
    address[] private total_tokens;

    constructor(address owner, address _usdt) Ownable(owner) {
        stableToken = IERC20(_usdt);
        bondingCurve = new BancorBondingCurve();
    }

    event TokenCreated(address token, string name, string symbol);
    event TokenBought(
        address token,
        address buyer,
        uint256 amount,
        uint256 tokenAmount,
        uint256 price
    );
    event TokenSold(
        address token,
        address seller,
        uint256 amount,
        uint256 tokenAmount,
        uint256 price
    );

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
        total_tokens.push(address(token));
        usdtSuplly[address(token)] = INITIAL_COLLATORAL;
        emit TokenCreated(address(token), name, symbol);
    }

    // amount in token
    function buy(address token, uint256 amount) external payable whenNotPaused {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(amount > 0, "Amount must be greater than 0");

        uint256 _supply = Token(token).totalSupply();
        uint256 amountToken = bondingCurve.calculatePurchaseReturn(
            _supply,
            usdtSuplly[token],
            RR,
            amount
        );

        // withdraw from usdt contract
        require(
            stableToken.balanceOf(msg.sender) >= amount,
            "Insufficient balance"
        );
        require(
            stableToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );
        require(
            stableToken.transferFrom(msg.sender, address(this), amount) == true,
            "Transfer failed"
        );

        require(Token(token).mint(msg.sender, amountToken) == true);
        usdtSuplly[token] += amount;

        emit TokenBought(
            token,
            msg.sender,
            amount,
            amountToken,
            getPrice(token)
        );
    }

    function sell(address token, uint256 amountToken) external whenNotPaused {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(amountToken > 0, "Amount must be greater than 0");

        uint256 _supply = Token(token).totalSupply();
        uint256 amount = bondingCurve.calculateSaleReturn(
            _supply,
            usdtSuplly[token],
            RR,
            amountToken
        );

        require(Token(token).burn(msg.sender, amountToken) == true);
        require(stableToken.transfer(msg.sender, amount) == true);
        usdtSuplly[token] -= amount;

        emit TokenSold(token, msg.sender, amount, amountToken, getPrice(token));
    }

    function calculateTokenReturn(
        address token,
        uint256 amount
    ) external view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(amount > 0, "Amount must be greater than 0");
        uint256 _supply = Token(token).totalSupply();

        return
            bondingCurve.calculatePurchaseReturn(
                _supply,
                usdtSuplly[token],
                RR,
                amount
            );
    }

    function calculateSaleReturn(
        address token,
        uint256 amountToken
    ) external view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(amountToken > 0, "Amount must be greater than 0");
        uint256 _supply = Token(token).totalSupply();

        return
            bondingCurve.calculateSaleReturn(
                _supply,
                usdtSuplly[token],
                RR,
                amountToken
            );
    }

    function getPrice(address token) public view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");

        uint256 _supply = Token(token).totalSupply();

        return
            bondingCurve.calculateSaleReturn(_supply, usdtSuplly[token], RR, 1);
    }

    function getMarketCap(address token) external view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        return usdtSuplly[token];
    }

    function launch(address token) external onlyOwner {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(tokens[token].launched == false, "Token is already launched");

        // integrate dex
        // add liquidity

        tokens[token].launched = true;
    }

    function getTokens() external view returns (address[] memory) {
        return total_tokens;
    }

    function getToken(
        address token
    )
        external
        view
        returns (string memory, string memory, string memory, bool)
    {
        return (
            tokens[token].name,
            tokens[token].symbol,
            tokens[token].uri,
            tokens[token].launched
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
