export interface Pool {
  id: number;
  seller: string;
  monadToken: string; // ERC20 token address
  endTime: number; // Unix timestamp
  settled: boolean;
  minPrice: string; // Wei
  monadForSale: string; // Token amount
  clearingPrice: string; // Wei
  totalMonadAllocated: string; // Token amount
}

export interface Commit {
  hash: string;
  exists: boolean;
  revealed: boolean;
}

export interface Bid {
  user: string;
  amountMonad: string;
  price: string;
}

export interface PoolPhase {
  phase: 'COMMIT' | 'REVEAL' | 'FINALIZE' | 'SETTLED';
  timeRemaining: number;
  canInteract: boolean;
}

export interface CreatePoolForm {
  monadToken: string;
  sellerAddress: string;
  endTime: Date;
  minPrice: string;
  monadForSale: string;
}

export interface CommitForm {
  amountMonad: string;
  price: string;
  salt: string;
  hash: string;
}

export interface RevealForm {
  amountMonad: string;
  price: string;
  salt: string;
  ethAmount: string;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

export interface AuctionStats {
  totalPools: number;
  totalVolume: string;
  activePools: number;
  completedPools: number;
}

