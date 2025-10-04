export const CONTRACTS = {
  PARALLEL_AUCTIONS: '0x798c40889cbcd639e08bba3f6ca16406822ba035', // Deploy edilen kontrat adresi
  MOCK_MONAD: '0xc6d1296b9780a39360fac7aabcb21ab750615afc', // MockMonad token kontrat adresi
} as const;

export const NETWORKS = {
  MONAD_TESTNET: {
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://testnet-rpc.monad.xyz'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Monad Explorer',
        url: 'https://testnet-explorer.monad.xyz',
      },
    },
    testnet: true,
  },
} as const;

export const PHASES = {
  COMMIT: 'COMMIT',
  REVEAL: 'REVEAL', 
  FINALIZE: 'FINALIZE',
  SETTLED: 'SETTLED',
} as const;

export const REVEAL_WINDOW = 15 * 60 * 1000; // 15 minutes in ms

export const PHASE_COLORS = {
  COMMIT: 'bg-blue-100 text-blue-800 border-blue-200',
  REVEAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  FINALIZE: 'bg-green-100 text-green-800 border-green-200',
  SETTLED: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

export const PHASE_ICONS = {
  COMMIT: 'Lock',
  REVEAL: 'Eye',
  FINALIZE: 'CheckCircle',
  SETTLED: 'Archive',
} as const;

