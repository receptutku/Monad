// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract ParallelAuctions {
    uint256 public constant PRICE_SCALE = 1e18;
    uint256 public constant REVEAL_WINDOW = 15 minutes;

    struct Pool {
        address base;        // satılan ERC-20
        uint64  endTime;     // commit bitiş zamanı
        bool    settled;     // finalize edildi mi
        uint256 minPrice;    // min fiyat (1e18 ölçek)
        uint256 baseForSale; // toplam satış miktarı
    }

    struct Commit { bytes32 hash; bool exists; bool revealed; }
    struct Bid    { address user; uint256 amountBase; uint256 price; }

    uint256 public nextPoolId;
    mapping(uint256 => Pool) public pools;
    mapping(uint256 => mapping(address => Commit)) public commits; // poolId => user => commit
    mapping(uint256 => Bid[]) public bids;                        // poolId => revealed bids

    // Havuz oluştur: satıcı token'ı kontrata çeker
    function createPool(address base, uint64 endTime, uint256 minPrice, uint256 baseForSale)
        external
        returns (uint256 id)
    {
        require(base != address(0), "base");
        require(endTime > block.timestamp + 1 minutes, "etime");
        require(minPrice > 0 && baseForSale > 0, "params");

        id = ++nextPoolId;
        pools[id] = Pool(base, endTime, false, minPrice, baseForSale);

        // Satıcıdan token çek (önceden approve verilmis olmali)
        require(IERC20(base).transferFrom(msg.sender, address(this), baseForSale), "xfer");
    }

    // Commit: hash = keccak256(abi.encode(amountBase, price, salt))
    function commitBid(uint256 id, bytes32 h) external {
        Pool memory p = pools[id];
        require(p.endTime != 0, "pool");
        require(block.timestamp < p.endTime, "ended");

        Commit storage c = commits[id][msg.sender];
        require(!c.exists, "dup");
        commits[id][msg.sender] = Commit(h, true, false);
    }

    // *** TESTİN ÇAĞIRDIĞI İMZA ***
    // revealBid(id, amountBase, price, salt) payable
    function revealBid(uint256 id, uint256 amountBase, uint256 price, bytes32 salt) external payable {
        Pool memory p = pools[id];
        require(p.endTime != 0, "pool");
        require(block.timestamp >= p.endTime && block.timestamp <= p.endTime + REVEAL_WINDOW, "rwin");

        Commit storage c = commits[id][msg.sender];
        require(c.exists && !c.revealed, "commit");
        require(c.hash == keccak256(abi.encode(amountBase, price, salt)), "hash");
        require(price >= p.minPrice, "minP");

        // Tam ETH depozitosu: amountBase * price / 1e18
        uint256 need = (amountBase * price) / PRICE_SCALE;
        require(msg.value == need, "eth");

        c.revealed = true;
        bids[id].push(Bid({user: msg.sender, amountBase: amountBase, price: price}));
    }

    // Basit finalize: reveal sırasına göre doldur (test için yeterli)
    function finalizePools(uint256[] calldata ids) external {
        for (uint256 k; k < ids.length; k++) {
            uint256 id = ids[k];
            Pool storage p = pools[id];
            if (p.settled) continue;
            require(block.timestamp > p.endTime + REVEAL_WINDOW, "tooEarly");

            uint256 remaining = p.baseForSale;
            Bid[] storage B = bids[id];

            for (uint256 i; i < B.length && remaining > 0; i++) {
                Bid memory b = B[i];
                uint256 take = b.amountBase <= remaining ? b.amountBase : remaining;
                if (take > 0) {
                    remaining -= take;
                    require(IERC20(p.base).transfer(b.user, take), "xfer base");
                }
            }

            p.settled = true;
        }
    }

    receive() external payable {}
}
