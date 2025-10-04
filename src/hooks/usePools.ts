'use client';

import { useAllPools } from './useParallelAuctions';
import { Pool, PoolPhase } from '@/types';

export const usePools = () => {
  const { pools, isLoading, totalPools } = useAllPools();

  const getPoolPhase = (pool: Pool): PoolPhase => {
    const now = Date.now() / 1000;
    const endTime = pool.endTime;
    const revealEndTime = endTime + 15 * 60; // 15 minutes

    if (now < endTime) {
      return {
        phase: 'COMMIT',
        timeRemaining: endTime - now,
        canInteract: true,
      };
    } else if (now < revealEndTime) {
      return {
        phase: 'REVEAL',
        timeRemaining: revealEndTime - now,
        canInteract: true,
      };
    } else if (!pool.settled) {
      return {
        phase: 'FINALIZE',
        timeRemaining: 0,
        canInteract: true,
      };
    } else {
      return {
        phase: 'SETTLED',
        timeRemaining: 0,
        canInteract: false,
      };
    }
  };

  const getPoolsByPhase = (phase: string) => {
    return pools.filter(pool => {
      const poolPhase = getPoolPhase(pool);
      return poolPhase.phase === phase;
    });
  };

  const getActivePools = () => {
    return pools.filter(pool => !pool.settled);
  };

  const getSettledPools = () => {
    return pools.filter(pool => pool.settled);
  };

  const getPoolsBySeller = (sellerAddress: string) => {
    return pools.filter(pool => 
      pool.seller.toLowerCase() === sellerAddress.toLowerCase()
    );
  };

  const getPoolsByToken = (tokenAddress: string) => {
    return pools.filter(pool => 
      pool.monadToken.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  const getTotalVolume = () => {
    return pools.reduce((total, pool) => {
      if (pool.settled && pool.clearingPrice !== '0') {
        const volume = BigInt(pool.totalMonadAllocated) * BigInt(pool.clearingPrice);
        return total + volume;
      }
      return total;
    }, BigInt(0));
  };

  const getAverageClearingPrice = () => {
    const settledPools = getSettledPools();
    if (settledPools.length === 0) return BigInt(0);

    const totalPrice = settledPools.reduce((total, pool) => {
      return total + BigInt(pool.clearingPrice);
    }, BigInt(0));

    return totalPrice / BigInt(settledPools.length);
  };

  const getPoolStats = () => {
    const activePools = getActivePools();
    const settledPools = getSettledPools();
    const totalVolume = getTotalVolume();

    return {
      totalPools: pools.length,
      activePools: activePools.length,
      settledPools: settledPools.length,
      totalVolume: totalVolume.toString(),
      averageClearingPrice: getAverageClearingPrice().toString(),
    };
  };

  return {
    pools,
    isLoading,
    totalPools,
    getPoolPhase,
    getPoolsByPhase,
    getActivePools,
    getSettledPools,
    getPoolsBySeller,
    getPoolsByToken,
    getTotalVolume,
    getAverageClearingPrice,
    getPoolStats,
  };
};

