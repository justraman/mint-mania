// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin-contracts-5.0.2/token/ERC20/ERC20.sol";
import "@openzeppelin-contracts-5.0.2/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin-contracts-5.0.2/token/ERC20/extensions/ERC20Capped.sol";

contract Token is ERC20, ERC20Capped, ERC20Burnable {
    constructor(
        string memory name,
        string memory symbol,
        uint intialSupply,
        uint maxSupply
    ) ERC20(name, symbol) ERC20Capped(maxSupply) {
        _mint(msg.sender, intialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 1;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Capped) {
        ERC20Capped._update(from, to, value);
    }
}
