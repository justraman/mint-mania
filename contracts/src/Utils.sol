// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract Utils {
    modifier greaterThanZero(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than zero");
        _;
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "Address cannot be zero address");
        _;
    }

    modifier notThis(address _address) {
        require(_address != address(this), "Address cannot be this contract address");
        _;
    }

    function safeAdd(uint256 _x, uint256 _y) internal pure returns (uint256) {
        unchecked {
            uint256 z = _x + _y;
            require(z >= _x, "SafeMath: addition overflow");
            return z;
        }
    }

    function safeSub(uint256 _x, uint256 _y) internal pure returns (uint256) {
        require(_x >= _y, "SafeMath: subtraction underflow");
        unchecked {
            return _x - _y;
        }
    }

    function safeMul(uint256 _x, uint256 _y) internal pure returns (uint256) {
        require(_x != 0);
        unchecked {
            uint256 z = _x * _y;
            require(z / _x == _y, "SafeMath: multiplication overflow");
            return z;
        }
    }
}
