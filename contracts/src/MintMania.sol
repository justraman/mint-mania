// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Token.sol";
import "./BondingCurve.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";
import "@openzeppelin-contracts-5.0.2/utils/Pausable.sol";
import "@openzeppelin-contracts-5.0.2/token/ERC20/IERC20.sol";
import "uniswap-v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "uniswap-v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "uniswap-v3-core/contracts/interfaces/IERC20Minimal.sol";
import { TransferHelper } from "uniswap-v3-periphery/contracts/libraries/TransferHelper.sol";

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
    uint32 private constant RR = 380020; // part per million

    IERC20 public immutable stableToken;
    BancorBondingCurve private immutable bondingCurve;
    INonfungiblePositionManager private immutable positionManager;

    mapping(address => TokenInfo) private tokens;
    mapping(address => uint256) private usdtSupply;
    address[] private total_tokens;

    constructor(
        address owner,
        address _usdt,
        address _positionManager
    ) Ownable(owner) {
        stableToken = IERC20(_usdt);
        bondingCurve = new BancorBondingCurve();
        positionManager = INonfungiblePositionManager(_positionManager);
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
    event TokenLaunched(address token);

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
        usdtSupply[address(token)] = INITIAL_COLLATORAL;
        emit TokenCreated(address(token), name, symbol);
    }

    // amount in token
    function buy(address token, uint256 amount) external payable whenNotPaused {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(tokens[token].launched == false, "Token is launched");
        require(amount > 0, "Amount must be greater than 0");

        uint256 _supply = Token(token).totalSupply();
        uint256 amountToken = bondingCurve.calculatePurchaseReturn(
            _supply,
            usdtSupply[token],
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
        usdtSupply[token] += amount;

        if (usdtSupply[token] > 69069_000_000) {
            launch(token);
        }

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
        require(tokens[token].launched == false, "Token is launched");
        require(amountToken > 0, "Amount must be greater than 0");

        uint256 _supply = Token(token).totalSupply();
        uint256 amount = bondingCurve.calculateSaleReturn(
            _supply,
            usdtSupply[token],
            RR,
            amountToken
        );

        require(Token(token).burn(msg.sender, amountToken) == true);
        require(stableToken.transfer(msg.sender, amount) == true);
        usdtSupply[token] -= amount;

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
                usdtSupply[token],
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
        require(tokens[token].launched == false, "Token is launched");
        uint256 _supply = Token(token).totalSupply();

        return
            bondingCurve.calculateSaleReturn(
                _supply,
                usdtSupply[token],
                RR,
                amountToken
            );
    }

    function getPrice(address token) public view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");

        uint256 _supply = Token(token).totalSupply();

        return
            bondingCurve.calculateSaleReturn(_supply, usdtSupply[token], RR, 1);
    }

    function getMarketCap(address token) external view returns (uint256) {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        return usdtSupply[token];
    }

    function launch(address token) private {
        require(bytes(tokens[token].name).length > 0, "Token does not exist");
        require(tokens[token].launched == false, "Token is already launched");

        // Define the amounts to add to liquidity
        uint256 tokenAmount = 200_000_000;
        uint256 usdtAmount = usdtSupply[token];

        require(
            Token(token).balanceOf(address(this)) >= tokenAmount,
            "Insufficient token balance"
        );
        require(
            stableToken.balanceOf(address(this)) >= usdtAmount,
            "Insufficient USDT balance"
        );

        TransferHelper.safeApprove(
            token,
            address(positionManager),
            tokenAmount
        );

        TransferHelper.safeApprove(
            address(stableToken),
            address(positionManager),
            usdtAmount
        );

        // Mint the liquidity position on Uniswap V3
        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: token,
                token1: address(stableToken),
                fee: 1000,
                tickLower: -683108,
                tickUpper: 887220,
                amount0Desired: tokenAmount,
                amount1Desired: usdtAmount,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp + 1 minutes
            });

        (uint256 lpTokenId, , , ) = positionManager.mint(params);

        positionManager.burn(lpTokenId);
        tokens[token].launched = true;
        emit TokenLaunched(token);
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
