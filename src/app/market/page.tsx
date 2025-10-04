'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreatePoolModal } from '@/components/auction/CreatePoolModal';
import { PoolCard } from '@/components/auction/PoolCard';
import { Pool, PoolPhase } from '@/types';
import { 
  Plus, 
  Filter, 
  Search, 
  TrendingUp, 
  Clock, 
  Users,
  Zap,
  RefreshCw
} from 'lucide-react';
import { formatTimeShort } from '@/lib/utils';

export default function MarketPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pools, setPools] = useState<Pool[]>([
    {
      id: 1,
      seller: '0x1234567890123456789012345678901234567890',
      monadToken: '0x4567890123456789012345678901234567890123',
      endTime: Date.now() / 1000 + 1800, // 30 minutes
      settled: false,
      minPrice: '1000000000000000000', // 1 ETH
      monadForSale: '100000000000000000000', // 100 tokens
      clearingPrice: '0',
      totalMonadAllocated: '0',
    },
    {
      id: 2,
      seller: '0x2345678901234567890123456789012345678901',
      monadToken: '0x5678901234567890123456789012345678901234',
      endTime: Date.now() / 1000 + 3600, // 1 hour
      settled: false,
      minPrice: '2000000000000000000', // 2 ETH
      monadForSale: '50000000000000000000', // 50 tokens
      clearingPrice: '0',
      totalMonadAllocated: '0',
    },
    {
      id: 3,
      seller: '0x3456789012345678901234567890123456789012',
      monadToken: '0x6789012345678901234567890123456789012345',
      endTime: Date.now() / 1000 - 3600, // 1 hour ago (settled)
      settled: true,
      minPrice: '1500000000000000000', // 1.5 ETH
      monadForSale: '75000000000000000000', // 75 tokens
      clearingPrice: '2500000000000000000', // 2.5 ETH
      totalMonadAllocated: '75000000000000000000', // 75 tokens
    },
  ]);
  const [filteredPools, setFilteredPools] = useState<Pool[]>([
    {
      id: 1,
      seller: '0x1234567890123456789012345678901234567890',
      monadToken: '0x4567890123456789012345678901234567890123',
      endTime: Date.now() / 1000 + 1800, // 30 minutes
      settled: false,
      minPrice: '1000000000000000000', // 1 ETH
      monadForSale: '100000000000000000000', // 100 tokens
      clearingPrice: '0',
      totalMonadAllocated: '0',
    },
    {
      id: 2,
      seller: '0x2345678901234567890123456789012345678901',
      monadToken: '0x5678901234567890123456789012345678901234',
      endTime: Date.now() / 1000 + 3600, // 1 hour
      settled: false,
      minPrice: '2000000000000000000', // 2 ETH
      monadForSale: '50000000000000000000', // 50 tokens
      clearingPrice: '0',
      totalMonadAllocated: '0',
    },
    {
      id: 3,
      seller: '0x3456789012345678901234567890123456789012',
      monadToken: '0x6789012345678901234567890123456789012345',
      endTime: Date.now() / 1000 - 3600, // 1 hour ago (settled)
      settled: true,
      minPrice: '1500000000000000000', // 1.5 ETH
      monadForSale: '75000000000000000000', // 75 tokens
      clearingPrice: '2500000000000000000', // 2.5 ETH
      totalMonadAllocated: '75000000000000000000', // 75 tokens
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Load pools from localStorage and mock data
  useEffect(() => {
    const loadPools = () => {
      setIsLoading(true);
      
      // Load pools from localStorage first (only on client side)
      const localStoragePools: Pool[] = [];
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('pool_')) {
            try {
              const poolData = JSON.parse(localStorage.getItem(key) || '{}');
              if (poolData.id) {
                localStoragePools.push(poolData);
              }
            } catch (error) {
              console.error('Error parsing pool data:', error);
            }
          }
        }
      }
      
      const mockPools: Pool[] = [
        {
          id: 1,
          seller: '0x1234567890123456789012345678901234567890',
          monadToken: '0x4567890123456789012345678901234567890123',
          endTime: Date.now() / 1000 + 1800, // 30 minutes
          settled: false,
          minPrice: '1000000000000000000', // 1 ETH
          monadForSale: '100000000000000000000', // 100 tokens
          clearingPrice: '0',
          totalMonadAllocated: '0',
        },
        {
          id: 2,
          seller: '0x2345678901234567890123456789012345678901',
          monadToken: '0x5678901234567890123456789012345678901234',
          endTime: Date.now() / 1000 + 3600, // 1 hour
          settled: false,
          minPrice: '2000000000000000000', // 2 ETH
          monadForSale: '50000000000000000000', // 50 tokens
          clearingPrice: '0',
          totalMonadAllocated: '0',
        },
        {
          id: 3,
          seller: '0x3456789012345678901234567890123456789012',
          monadToken: '0x6789012345678901234567890123456789012345',
          endTime: Date.now() / 1000 - 300, // 5 minutes ago (reveal phase)
          settled: false,
          minPrice: '1500000000000000000', // 1.5 ETH
          monadForSale: '200000000000000000000', // 200 tokens
          clearingPrice: '0',
          totalMonadAllocated: '0',
        },
        {
          id: 4,
          seller: '0x4567890123456789012345678901234567890123',
          monadToken: '0x7890123456789012345678901234567890123456',
          endTime: Date.now() / 1000 - 1200, // 20 minutes ago (finalize phase)
          settled: false,
          minPrice: '500000000000000000', // 0.5 ETH
          monadForSale: '1000000000000000000000', // 1000 tokens
          clearingPrice: '0',
          totalMonadAllocated: '0',
        },
        {
          id: 5,
          seller: '0x5678901234567890123456789012345678901234',
          monadToken: '0x8901234567890123456789012345678901234567',
          endTime: Date.now() / 1000 - 3600, // 1 hour ago (settled)
          settled: true,
          minPrice: '3000000000000000000', // 3 ETH
          monadForSale: '75000000000000000000', // 75 tokens
          clearingPrice: '2500000000000000000', // 2.5 ETH
          totalMonadAllocated: '75000000000000000000', // 75 tokens
        },
      ];
      
      // Combine localStorage pools with mock pools
      const allPools = [...localStoragePools, ...mockPools];
      
      setPools(allPools);
      setFilteredPools(allPools);
      setIsLoading(false);
    };

    loadPools();
  }, []);

  // Filter pools based on search and phase
  useEffect(() => {
    let filtered = pools;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pool => 
        pool.id.toString().includes(searchTerm) ||
        pool.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Phase filter
    if (filterPhase !== 'all') {
      filtered = filtered.filter(pool => {
        const now = Date.now() / 1000;
        const endTime = pool.endTime;
        const revealEndTime = endTime + 15 * 60; // 15 minutes

        if (filterPhase === 'COMMIT') {
          return now < endTime;
        } else if (filterPhase === 'REVEAL') {
          return now >= endTime && now < revealEndTime;
        } else if (filterPhase === 'FINALIZE') {
          return now >= revealEndTime && !pool.settled;
        } else if (filterPhase === 'SETTLED') {
          return pool.settled;
        }
        return true;
      });
    }

    setFilteredPools(filtered);
  }, [pools, searchTerm, filterPhase]);

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

  const handleViewDetails = (poolId: number) => {
    // Navigate to pool detail page
    router.push(`/pool/${poolId}`);
  };

  const handleRefresh = () => {
    // Refresh pools data
    window.location.reload();
  };

  const phaseOptions = [
    { value: 'all', label: 'All Phases' },
    { value: 'COMMIT', label: 'Commit' },
    { value: 'REVEAL', label: 'Reveal' },
    { value: 'FINALIZE', label: 'Finalize' },
    { value: 'SETTLED', label: 'Settled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parallel Auctions Market
            </h1>
            <p className="text-gray-600">
              Discover and participate in commit-reveal batch auctions
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
            {isConnected && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="h-4 w-4" />}
              >
                Create Pool
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pools</p>
                  <p className="text-2xl font-bold text-gray-900">{pools.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Pools</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pools.filter(p => !p.settled).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Settled Pools</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pools.filter(p => p.settled).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pools by ID or seller address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Filter className="h-4 w-4 text-gray-400 mt-2" />
                <select
                  value={filterPhase}
                  onChange={(e) => setFilterPhase(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {phaseOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                phase={getPoolPhase(pool)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No pools found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterPhase !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to create a pool!'
                }
              </p>
              {isConnected && (
                <Button onClick={() => setShowCreateModal(true)}>
                  Create First Pool
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Pool Modal */}
        <CreatePoolModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  );
}

