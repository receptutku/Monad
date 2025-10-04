'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MOCK_ERC20_ABI } from '@/lib/contracts';
import { TokenInfo } from '@/types';
import toast from 'react-hot-toast';

export const useERC20 = (tokenAddress: string) => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: name } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MOCK_ERC20_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MOCK_ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MOCK_ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MOCK_ERC20_ABI,
    functionName: 'totalSupply',
  });

  // Function to approve tokens
  const approve = async (spender: string, amount: string) => {
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: MOCK_ERC20_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, BigInt(amount)],
      });
      toast.success('Approval transaction submitted!');
    } catch (err) {
      console.error('Error approving tokens:', err);
      toast.error('Failed to approve tokens');
      throw err;
    }
  };

  // Function to transfer tokens
  const transfer = async (to: string, amount: string) => {
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: MOCK_ERC20_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, BigInt(amount)],
      });
      toast.success('Transfer transaction submitted!');
    } catch (err) {
      console.error('Error transferring tokens:', err);
      toast.error('Failed to transfer tokens');
      throw err;
    }
  };

  // Function to transfer from
  const transferFrom = async (from: string, to: string, amount: string) => {
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: MOCK_ERC20_ABI,
        functionName: 'transferFrom',
        args: [from as `0x${string}`, to as `0x${string}`, BigInt(amount)],
      });
      toast.success('Transfer from transaction submitted!');
    } catch (err) {
      console.error('Error transferring from:', err);
      toast.error('Failed to transfer from');
      throw err;
    }
  };

  // Function to mint tokens
  const mint = async (to: string, amount: string) => {
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: MOCK_ERC20_ABI,
        functionName: 'mint',
        args: [to as `0x${string}`, BigInt(amount)],
      });
      toast.success('Mint transaction submitted!');
    } catch (err) {
      console.error('Error minting tokens:', err);
      toast.error('Failed to mint tokens');
      throw err;
    }
  };

  return {
    name: name as string,
    symbol: symbol as string,
    decimals: decimals as number,
    totalSupply: totalSupply?.toString(),
    approve,
    transfer,
    transferFrom,
    mint,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};

export const useTokenBalance = (tokenAddress: string, userAddress?: string) => {
  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MOCK_ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`],
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    balance: balance?.toString(),
    isLoading,
    error,
    refetch,
  };
};

export const useTokenAllowance = (
  tokenAddress: string, 
  ownerAddress?: string, 
  spenderAddress?: string
) => {
  const { data: allowance, isLoading, error, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: MOCK_ERC20_ABI,
    functionName: 'allowance',
    args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`],
    query: {
      enabled: !!ownerAddress && !!spenderAddress,
    },
  });

  return {
    allowance: allowance?.toString(),
    isLoading,
    error,
    refetch,
  };
};

export const useTokenInfo = (tokenAddress: string): TokenInfo | null => {
  const { name, symbol, decimals, totalSupply } = useERC20(tokenAddress);

  if (!name || !symbol || !decimals || !totalSupply) {
    return null;
  }

  return {
    address: tokenAddress,
    name,
    symbol,
    decimals,
    balance: '0', // This would need to be fetched separately with user address
  };
};

