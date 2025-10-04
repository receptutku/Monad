'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CommitBidForm } from '@/components/auction/CommitBidForm';
import { RevealBidForm } from '@/components/auction/RevealBidForm';
import { BidsTable } from '@/components/auction/BidsTable';
import { FinalizeButton } from '@/components/auction/FinalizeButton';
import { Pool, PoolPhase } from '@/types';
import { formatAddress, formatTimeShort, formatPrice, formatTokenAmount, getPhaseColor } from '@/lib/utils';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Coins, 
  DollarSign,
  TrendingUp,
  Eye,
  Lock,
  CheckCircle,
  Archive
} from 'lucide-react';

export default function PoolDetailPage() {
  const params = useParams();
  const poolId = Number(params.id);
  const { address } = useAccount();
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [phase, setPhase] = useState<PoolPhase | null>(null);
  const [activeTab, setActiveTab] = useState<'commit' | 'reveal' | 'bids'>('commit');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - gerçek uygulamada contract'tan çekilecek
  useEffect(() => {
    const loadPool = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to load pool data from localStorage first (for newly created pools)
      const storedPoolData = localStorage.getItem(`pool_${poolId}`);
      
      let poolData: Pool;
      
      if (storedPoolData) {
        // Use stored pool data (from CreatePoolModal)
        const parsed = JSON.parse(storedPoolData);
        poolData = {
          id: poolId,
          seller: parsed.seller || address || '0x1234567890123456789012345678901234567890',
          monadToken: parsed.monadToken || '0x4567890123456789012345678901234567890123',
          endTime: parsed.endTime || (Date.now() / 1000 + 1800),
          settled: false,
          minPrice: parsed.minPrice || '1000000000000000000',
          monadForSale: parsed.monadForSale || '100000000000000000000',
          clearingPrice: '0',
          totalMonadAllocated: '0',
        };
      } else {
        // Fallback to mock data for existing pools
        poolData = {
          id: poolId,
          seller: address || '0x1234567890123456789012345678901234567890',
          monadToken: '0x4567890123456789012345678901234567890123',
          endTime: Date.now() / 1000 + 1800,
          settled: false,
          minPrice: '1000000000000000000',
          monadForSale: '100000000000000000000',
          clearingPrice: '0',
          totalMonadAllocated: '0',
        };
      }
      
      setPool(poolData);
      
      // Calculate phase
      const now = Date.now() / 1000;
      const endTime = poolData.endTime;
      const revealEndTime = endTime + 15 * 60; // 15 minutes

      let poolPhase: PoolPhase;
      if (now < endTime) {
        poolPhase = {
          phase: 'COMMIT',
          timeRemaining: endTime - now,
          canInteract: true,
        };
      } else if (now < revealEndTime) {
        poolPhase = {
          phase: 'REVEAL',
          timeRemaining: revealEndTime - now,
          canInteract: true,
        };
      } else if (!poolData.settled) {
        poolPhase = {
          phase: 'FINALIZE',
          timeRemaining: 0,
          canInteract: true,
        };
      } else {
        poolPhase = {
          phase: 'SETTLED',
          timeRemaining: 0,
          canInteract: false,
        };
      }
      
      setPhase(poolPhase);
      setIsLoading(false);
    };

    loadPool();
  }, [poolId]);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'COMMIT': return <Lock className="h-4 w-4" />;
      case 'REVEAL': return <Eye className="h-4 w-4" />;
      case 'FINALIZE': return <CheckCircle className="h-4 w-4" />;
      case 'SETTLED': return <Archive className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="lg:col-span-2">
                  <div className="h-96 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pool || !phase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Pool Not Found</h1>
            <p className="text-gray-600 mb-6">The pool you're looking for doesn't exist.</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pool #{pool.id}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge 
                  variant="default" 
                  className={`${getPhaseColor(phase.phase)} border`}
                  icon={getPhaseIcon(phase.phase)}
                >
                  {phase.phase}
                </Badge>
                {phase.timeRemaining > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {formatTimeShort(phase.timeRemaining)} remaining
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pool Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Pool Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Seller</p>
                      <p className="font-mono text-sm">{formatAddress(pool.seller)}</p>
                    </div>
                    
                    {address && (
                      <div>
                        <p className="text-sm text-gray-500">Your Wallet (Payer)</p>
                        <p className="font-mono text-sm">{formatAddress(address)}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Monad Token</p>
                      <p className="font-mono text-sm">{formatAddress(pool.monadToken)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Minimum Price</p>
                      <p className="text-lg font-semibold">{formatPrice(pool.minPrice)} ETH</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">For Sale</p>
                      <p className="text-lg font-semibold">{formatTokenAmount(pool.monadForSale)} tokens</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Clearing Price</p>
                      <p className="text-lg font-semibold text-primary-600">
                        {pool.clearingPrice !== '0' ? `${formatPrice(pool.clearingPrice)} ETH` : 'TBD'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Allocated</p>
                      <p className="text-lg font-semibold">
                        {formatTokenAmount(pool.totalMonadAllocated)} / {formatTokenAmount(pool.monadForSale)} tokens
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {pool.settled && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Allocation Progress</span>
                        <span className="font-medium">
                          {Math.round((parseFloat(pool.totalMonadAllocated) / parseFloat(pool.monadForSale)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(parseFloat(pool.totalMonadAllocated) / parseFloat(pool.monadForSale)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex gap-2">
                    <Button
                      variant={activeTab === 'commit' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('commit')}
                      disabled={phase.phase !== 'COMMIT'}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Commit
                    </Button>
                    <Button
                      variant={activeTab === 'reveal' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('reveal')}
                      disabled={phase.phase !== 'REVEAL'}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Reveal
                    </Button>
                    <Button
                      variant={activeTab === 'bids' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('bids')}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Bids
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === 'commit' && phase.phase === 'COMMIT' && (
                    <CommitBidForm poolId={pool.id} minPrice={pool.minPrice} />
                  )}
                  
                  {activeTab === 'reveal' && phase.phase === 'REVEAL' && (
                    <RevealBidForm poolId={pool.id} minPrice={pool.minPrice} />
                  )}
                  
                  {activeTab === 'bids' && (
                    <div className="space-y-6">
                      <BidsTable 
                        poolId={pool.id} 
                        bids={[]} 
                        clearingPrice={pool.clearingPrice}
                        userAddress={address}
                      />
                      {phase.phase === 'FINALIZE' && (
                        <FinalizeButton 
                          poolId={pool.id} 
                          canFinalize={true}
                        />
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'commit' && phase.phase !== 'COMMIT' && (
                    <div className="text-center py-8">
                      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Commit Phase Ended
                      </h3>
                      <p className="text-gray-600">
                        The commit phase has ended. You can no longer submit new bids.
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'reveal' && phase.phase !== 'REVEAL' && (
                    <div className="text-center py-8">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Reveal Phase Not Active
                      </h3>
                      <p className="text-gray-600">
                        {phase.phase === 'COMMIT' 
                          ? 'Reveal phase will begin after commit phase ends.'
                          : 'Reveal phase has ended. Check the bids tab for results.'
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

