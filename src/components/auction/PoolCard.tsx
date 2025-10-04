'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatAddress, formatTimeShort, formatPrice, formatTokenAmount, getPhaseColor } from '@/lib/utils';
import { Pool, PoolPhase } from '@/types';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Eye,
  Lock,
  CheckCircle,
  Archive
} from 'lucide-react';

interface PoolCardProps {
  pool: Pool;
  phase: PoolPhase;
  onViewDetails: (poolId: number) => void;
}

export const PoolCard = ({ pool, phase, onViewDetails }: PoolCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'COMMIT': return <Lock className="h-4 w-4" />;
      case 'REVEAL': return <Eye className="h-4 w-4" />;
      case 'FINALIZE': return <CheckCircle className="h-4 w-4" />;
      case 'SETTLED': return <Archive className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleCardClick = () => {
    router.push(`/pool/${pool.id}`);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        isHovered ? 'ring-2 ring-primary-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-1">Pool #{pool.id}</CardTitle>
            <p className="text-sm text-gray-500">
              by {formatAddress(pool.seller)}
            </p>
          </div>
          <Badge 
            variant="default" 
            className={`${getPhaseColor(phase.phase)} border`}
            icon={getPhaseIcon(phase.phase)}
          >
            {phase.phase}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pool Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Min Price</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(pool.minPrice)} ETH
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">For Sale</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatTokenAmount(pool.monadForSale)} tokens
            </p>
          </div>
        </div>

        {/* Clearing Price */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Clearing Price</p>
          <p className="text-xl font-bold text-primary-600">
            {pool.clearingPrice !== '0' ? `${formatPrice(pool.clearingPrice)} ETH` : 'TBD'}
          </p>
        </div>

        {/* Time Remaining */}
        {phase.timeRemaining > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {formatTimeShort(phase.timeRemaining)} remaining
            </span>
          </div>
        )}

        {/* Progress Bar for Settled Pools */}
        {pool.settled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Allocated</span>
              <span className="font-medium">
                {formatTokenAmount(pool.totalMonadAllocated)} / {formatTokenAmount(pool.monadForSale)}
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(pool.id);
            }}
          >
            View Details
          </Button>
          {phase.phase === 'FINALIZE' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                // Handle finalize action
              }}
            >
              Finalize
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

