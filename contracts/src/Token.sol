// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin-contracts-5.0.2/token/ERC20/ERC20.sol";
import "@openzeppelin-contracts-5.0.2/access/Ownable.sol";
import "@openzeppelin-contracts-5.0.2/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin-contracts-5.0.2/token/ERC20/extensions/ERC20Capped.sol";

contract Token is ERC20, ERC20Capped, ERC20Burnable, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint intialSupply,
        uint maxSupply
    ) ERC20(name, symbol) ERC20Capped(maxSupply) Ownable(msg.sender) {
        _mint(msg.sender, intialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Capped) {
        ERC20Capped._update(from, to, value);
    }

    function mint(address to, uint256 value) public onlyOwner returns (bool) {
        _update(address(0), to, value);
        return true;
    }

    function burn(address from, uint256 value) public onlyOwner returns (bool) {
        _burn(from, value);
        return true;
    }
}
