'use client';

import { useAccount, useChainId } from 'wagmi';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const NetworkStatus = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  if (!isConnected) {
    return (
      <Badge variant="danger" icon={<AlertCircle className="h-3 w-3" />}>
        Not Connected
      </Badge>
    );
  }

  const isMonadTestnet = chainId === 10143;

  return (
    <Badge 
      variant={isMonadTestnet ? "info" : "danger"} 
      icon={isMonadTestnet ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
    >
      {isMonadTestnet ? 'Monad Testnet' : `Chain ID: ${chainId}`}
    </Badge>
  );
};

