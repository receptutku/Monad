'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Zap, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface FinalizeButtonProps {
  poolId: number;
  canFinalize: boolean;
  onFinalize?: () => void;
}

export const FinalizeButton = ({ poolId, canFinalize, onFinalize }: FinalizeButtonProps) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalize = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!canFinalize) {
      toast.error('Pool cannot be finalized yet');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement contract interaction
      console.log('Finalizing pool:', poolId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Pool finalized successfully!');
      
      if (onFinalize) {
        onFinalize();
      }
    } catch (error) {
      console.error('Error finalizing pool:', error);
      toast.error('Failed to finalize pool. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <CheckCircle className="h-5 w-5" />
          Finalize Pool
        </CardTitle>
        <p className="text-sm text-green-700">
          Calculate clearing price and allocate tokens to winning bidders
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Finalization Status */}
        <div className="flex items-center gap-3">
          {canFinalize ? (
            <>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Ready to Finalize</p>
                <p className="text-sm text-green-700">
                  All reveal windows have closed. Pool can be finalized.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-yellow-900">Not Ready</p>
                <p className="text-sm text-yellow-700">
                  Reveal window is still active. Wait for it to close.
                </p>
              </div>
            </>
          )}
        </div>

        {/* What Happens During Finalization */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">What happens during finalization:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span>Calculate uniform clearing price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span>Allocate base tokens to winning bidders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span>Refund excess ETH to bidders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span>Mark pool as settled</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Important</p>
              <p className="text-sm text-yellow-700">
                Finalization is irreversible. Make sure all bidders have revealed their bids.
              </p>
            </div>
          </div>
        </div>

        {/* Finalize Button */}
        <Button 
          onClick={handleFinalize}
          loading={isLoading}
          disabled={!address || !canFinalize}
          className="w-full"
          variant="primary"
          icon={<Zap className="h-4 w-4" />}
        >
          {isLoading ? 'Finalizing Pool...' : 'Finalize Pool'}
        </Button>
        
        {!address && (
          <p className="text-sm text-red-600 text-center">
            Please connect your wallet to finalize the pool
          </p>
        )}
      </CardContent>
    </Card>
  );
};

