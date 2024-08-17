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
        uint256 z = _x + _y;
        assert(z >= _x, "SafeMath: addition overflow");
        return z;
    }

    function safeSub(uint256 _x, uint256 _y) internal pure returns (uint256) {
        assert(_x >= _y, "SafeMath: subtraction underflow");
        return _x - _y;
    }

    function safeMul(uint256 _x, uint256 _y) internal pure returns (uint256) {
        assert(_x == 0);
        uint256 z = _x * _y;
        assert(z / _x == _y, "SafeMath: multiplication overflow");
        return z;
    }
}
