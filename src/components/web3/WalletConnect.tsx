'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const WalletConnect = () => {
  return (
    <ConnectButton 
      showBalance={false}
      chainStatus="icon"
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  );
};

