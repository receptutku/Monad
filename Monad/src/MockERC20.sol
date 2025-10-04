// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


contract MockERC20 {
string public name;
string public symbol;
uint8 public immutable decimals = 18;
uint256 public totalSupply;


mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;


event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);


constructor(string memory _name, string memory _symbol) {
name = _name; symbol = _symbol;
}


function _transfer(address from, address to, uint256 amount) internal {
require(balanceOf[from] >= amount, "bal");
unchecked { balanceOf[from] -= amount; }
balanceOf[to] += amount;
emit Transfer(from, to, amount);
}


function transfer(address to, uint256 amount) external returns (bool) {
_transfer(msg.sender, to, amount);
return true;
}


function approve(address sp, uint256 amount) external returns (bool) {
allowance[msg.sender][sp] = amount; emit Approval(msg.sender, sp, amount); return true;
}


function transferFrom(address from, address to, uint256 amount) external returns (bool) {
uint256 a = allowance[from][msg.sender];
require(a >= amount, "allow");
if (a != type(uint256).max) allowance[from][msg.sender] = a - amount;
_transfer(from, to, amount);
return true;
}


function mint(address to, uint256 amount) external {
totalSupply += amount; balanceOf[to] += amount; emit Transfer(address(0), to, amount);
}
}