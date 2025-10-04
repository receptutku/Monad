// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


interface IERC20 {
function transfer(address to, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);
}


/// @title Parallel Batch-Auctions (Uniform Price)
/// @notice Commit → Reveal (ETH deposits) → Single finalize per pool (or finalize-many)
/// Seller deposits base tokens beforehand; winners receive base, losers get ETH refund.
contract ParallelAuctions {
// --- Reentrancy Guard ---
uint256 private _locked;
modifier nonReentrant() {
require(_locked == 0, "reent");
_locked = 1; _; _locked = 0;
}


uint256 public constant PRICE_SCALE = 1e18; // quote per base (ETH per base token)
uint256 public constant REVEAL_WINDOW = 15 minutes;


struct Pool {
address seller;
address base; // ERC-20 being sold
uint64 endTime; // commit deadline
bool settled;
uint256 minPrice; // minimum acceptable price (scaled)
uint256 baseForSale; // total base tokens available
uint256 clearingPrice; // determined at finalize
uint256 totalBaseAllocated;
}


struct Commit { bytes32 hash; bool exists; bool revealed; }
struct Bid { address user; uint256 amountBase; uint256 price; }


uint256 public nextPoolId;
mapping(uint256 => Pool) public pools;
mapping(uint256 => mapping(address => Commit)) public commits; // poolId => user => commit
mapping(uint256 => Bid[]) public bids; // revealed bids stored per pool


event PoolCreated(uint256 indexed id, address indexed seller, address base, uint64 endTime, uint256 minPrice, uint256 baseForSale);
event Committed(uint256 indexed id, address indexed user, bytes32 hash);
event Revealed(uint256 indexed id, address indexed user, uint256 amountBase, uint256 price);
event Finalized(uint256 indexed id, uint256 clearingPrice, uint256 filledBase, uint256 bidders);
event Refunded(uint256 indexed id, address indexed user, uint256 amount);
event Winner(uint256 indexed id, address indexed user, uint256 filledBase, uint256 paid, uint256 refund);


function createPool(
address base,
uint64 endTime,
uint256 minPrice,
uint256 baseForSale
) external returns (uint256 id) {
require(base != address(0), "base");
require(endTime > block.timestamp + 1 minutes, "etime");
require(minPrice > 0 && baseForSale > 0, "params");


// Pull base tokens from seller now
require(IERC20(base).transferFrom(msg.sender, address(this), baseForSale), "xfer base");


id = ++nextPoolId;
pools[id] = Pool({
seller: msg.sender,
base: base,
endTime: endTime,
settled: false,
minPrice: minPrice,
baseForSale: baseForSale,
clearingPrice: 0,
totalBaseAllocated: 0
});
emit PoolCreated(id, msg.sender, base, endTime, minPrice, baseForSale);
}


/// @notice Commit: hash = keccak256(abi.encode(amountBase, price, salt))
function commitBid(uint256 id, bytes32 /* h */) external view {
Pool memory p = pools[id];
require(p.endTime != 0, "pool");
} 
}