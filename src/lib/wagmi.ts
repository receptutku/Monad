import { createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { NETWORKS } from './constants';

export const config = createConfig({
  chains: [
    NETWORKS.MONAD_TESTNET,
    mainnet,
    polygon,
    optimism,
    arbitrum,
  ],
});

