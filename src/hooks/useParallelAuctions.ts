'use client';

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'ethers';
import { PARALLEL_AUCTIONS_ABI } from '@/lib/contracts';
import { CONTRACTS } from '@/lib/constants';
import { Pool, Commit, Bid } from '@/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const useParallelAuctions = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Function to create a new pool
  const createPool = async (
    base: string,
    endTime: number,
    minPrice: string,
    baseForSale: string
  ) => {
    try {
      await writeContract({
        address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
        abi: PARALLEL_AUCTIONS_ABI,
        functionName: 'createPool',
        args: [
          base as `0x${string}`,
          BigInt(endTime),
          parseUnits(minPrice, 18), // Convert ETH to Wei
          parseUnits(baseForSale, 18), // Convert tokens to Wei
        ],
      });
      toast.success('Pool creation transaction submitted!');
    } catch (err) {
      console.error('Error creating pool:', err);
      toast.error('Failed to create pool');
      throw err;
    }
  };

  // Function to commit a bid
  const commitBid = async (poolId: number, hash: string) => {
    try {
      await writeContract({
        address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
        abi: PARALLEL_AUCTIONS_ABI,
        functionName: 'commitBid',
        args: [BigInt(poolId), hash as `0x${string}`],
      });
      toast.success('Bid commit transaction submitted!');
    } catch (err) {
      console.error('Error committing bid:', err);
      toast.error('Failed to commit bid');
      throw err;
    }
  };

  // Function to reveal a bid
  const revealBid = async (poolId: number, amountBase: string, price: string, salt: string) => {
    try {
      await writeContract({
        address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
        abi: PARALLEL_AUCTIONS_ABI,
        functionName: 'revealBid',
        args: [
          BigInt(poolId),
          BigInt(amountBase),
          BigInt(price),
          salt as `0x${string}`,
        ],
      });
      toast.success('Bid reveal transaction submitted!');
    } catch (err) {
      console.error('Error revealing bid:', err);
      toast.error('Failed to reveal bid');
      throw err;
    }
  };

  // Function to finalize a pool
  const finalizePool = async (poolId: number) => {
    try {
      await writeContract({
        address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
        abi: PARALLEL_AUCTIONS_ABI,
        functionName: 'finalizePools',
        args: [[BigInt(poolId)]],
      });
      toast.success('Pool finalize transaction submitted!');
    } catch (err) {
      console.error('Error finalizing pool:', err);
      toast.error('Failed to finalize pool');
      throw err;
    }
  };

  return {
    createPool,
    commitBid,
    revealBid,
    finalizePool,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};

export const usePool = (poolId: number) => {
  const { data: poolData, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
    abi: PARALLEL_AUCTIONS_ABI,
    functionName: 'pools',
    args: [BigInt(poolId)],
  });

  const pool: Pool | null = poolData ? {
    id: poolId,
    seller: poolData[0],
    monadToken: poolData[1],
    endTime: Number(poolData[2]),
    settled: poolData[3],
    minPrice: poolData[4].toString(),
    monadForSale: poolData[5].toString(),
    clearingPrice: poolData[6].toString(),
    totalMonadAllocated: poolData[7].toString(),
  } : null;

  return {
    pool,
    isLoading,
    error,
    refetch,
  };
};

export const useUserCommit = (poolId: number, userAddress?: string) => {
  const { data: commitData, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
    abi: PARALLEL_AUCTIONS_ABI,
    functionName: 'commits',
    args: [BigInt(poolId), userAddress as `0x${string}`],
    query: {
      enabled: !!userAddress,
    },
  });

  const commit: Commit | null = commitData ? {
    hash: commitData[0],
    exists: commitData[1],
    revealed: commitData[2],
  } : null;

  return {
    commit,
    isLoading,
    error,
    refetch,
  };
};

export const usePoolBids = (poolId: number) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: bidsCount } = useReadContract({
    address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
    abi: PARALLEL_AUCTIONS_ABI,
    functionName: 'getBidsCount',
    args: [BigInt(poolId)],
  });

  // Fetch all bids for the pool
  useEffect(() => {
    const fetchBids = async () => {
      if (!bidsCount || bidsCount === BigInt(0)) {
        setBids([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const bidsArray: Bid[] = [];

      try {
        // Fetch each bid individually
        for (let i = 0; i < Number(bidsCount); i++) {
          // This would need to be implemented in the contract or use events
          // For now, we'll use mock data
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, [poolId, bidsCount]);

  return {
    bids,
    isLoading,
    bidsCount: bidsCount ? Number(bidsCount) : 0,
  };
};

export const usePoolEvents = (poolId: number) => {
  const [events, setEvents] = useState<any[]>([]);

  // Note: Event listening would need to be implemented with wagmi v2
  // For now, we'll return empty events array
  // This would require useWatchContractEvent or similar hook

  return {
    events,
  };
};

export const useAllPools = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: nextPoolId } = useReadContract({
    address: CONTRACTS.PARALLEL_AUCTIONS as `0x${string}`,
    abi: PARALLEL_AUCTIONS_ABI,
    functionName: 'nextPoolId',
  });

  // Fetch all pools
  useEffect(() => {
    const fetchPools = async () => {
      if (!nextPoolId || nextPoolId === BigInt(0)) {
        setPools([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const poolsArray: Pool[] = [];

      try {
        // Fetch each pool individually
        for (let i = 1; i <= Number(nextPoolId); i++) {
          // This would need to be implemented with multiple contract reads
          // For now, we'll use mock data
        }
      } catch (error) {
        console.error('Error fetching pools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPools();
  }, [nextPoolId]);

  return {
    pools,
    isLoading,
    totalPools: nextPoolId ? Number(nextPoolId) : 0,
  };
};

