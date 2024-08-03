// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin-contracts-5.0.2/token/ERC20/extensions/ERC20Burnable.sol";

contract Token is ERC20, ERC20Burnable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function decimals() public view virtual override returns (uint8) {
        return 1;
    }

}
