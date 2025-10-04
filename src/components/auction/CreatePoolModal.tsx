'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CreatePoolForm } from '@/types';
import { Plus, Calendar, DollarSign, Coins } from 'lucide-react';
import { useParallelAuctions } from '@/hooks/useParallelAuctions';
import { useERC20, useTokenBalance } from '@/hooks/useERC20';
import { CONTRACTS } from '@/lib/constants';
import toast from 'react-hot-toast';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePoolModal = ({ isOpen, onClose }: CreatePoolModalProps) => {
  const { address } = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Contract hooks
  const { createPool, isPending: isCreatingPool, isConfirmed: isPoolCreated } = useParallelAuctions();
  const { approve, isPending: isApproving } = useERC20(CONTRACTS.MOCK_MONAD);
  const { balance: monadBalance, isLoading: isBalanceLoading, refetch: refetchBalance } = useTokenBalance(CONTRACTS.MOCK_MONAD, address);
  
    const [form, setForm] = useState<CreatePoolForm>({
      monadToken: CONTRACTS.MOCK_MONAD, // Fixed Monad token address
      sellerAddress: address || '', // Will be updated when address changes
      endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      minPrice: '',
      monadForSale: '',
    });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update seller address when wallet address changes
  useEffect(() => {
    if (address) {
      setForm(prev => ({ ...prev, sellerAddress: address }));
    }
  }, [address]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Monad token address is fixed, no validation needed
    // Seller address comes from connected wallet, no validation needed

    if (!form.minPrice) {
      newErrors.minPrice = 'Minimum price is required';
    } else if (parseFloat(form.minPrice) <= 0) {
      newErrors.minPrice = 'Price must be greater than 0';
    }

    if (!form.monadForSale) {
      newErrors.monadForSale = 'Amount for sale is required';
    } else if (parseFloat(form.monadForSale) <= 0) {
      newErrors.monadForSale = 'Amount must be greater than 0';
    } else if (monadBalance && parseFloat(form.monadForSale) > parseFloat(monadBalance)) {
      newErrors.monadForSale = `Insufficient balance. You have ${monadBalance} tokens`;
    }

    if (form.endTime <= new Date()) {
      newErrors.endTime = 'End time must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Check balance before proceeding
    if (monadBalance && parseFloat(form.monadForSale) > parseFloat(monadBalance)) {
      toast.error(`Insufficient Monad balance. You have ${monadBalance} tokens but need ${form.monadForSale}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Approve tokens for the contract
      toast.loading('Approving tokens...', { id: 'approve' });
      await approve(CONTRACTS.PARALLEL_AUCTIONS, form.monadForSale);
      toast.success('Tokens approved!', { id: 'approve' });
      
      // Step 2: Create pool
      toast.loading('Creating pool...', { id: 'create' });
      await createPool(
        form.monadToken,
        Math.floor(form.endTime.getTime() / 1000),
        form.minPrice,
        form.monadForSale
      );
      
      // Wait for transaction confirmation
      if (isPoolCreated) {
        toast.success('Pool created successfully!', { id: 'create' });
        onClose();
        
        // For demo purposes, generate a pool ID and store in localStorage
        // In real app, this would come from the contract event
        const newPoolId = Math.floor(Math.random() * 1000) + 1;
        const poolData = {
          id: newPoolId,
          seller: address,
          monadToken: form.monadToken,
          endTime: Math.floor(form.endTime.getTime() / 1000),
          minPrice: form.minPrice,
          monadForSale: form.monadForSale,
          created: Date.now()
        };
        
        localStorage.setItem(`pool_${newPoolId}`, JSON.stringify(poolData));
        
        // Navigate to the new pool's detail page
        router.push(`/pool/${newPoolId}`);
        
        // Reset form
        setForm({
          monadToken: CONTRACTS.MOCK_MONAD,
          sellerAddress: address || '',
          endTime: new Date(Date.now() + 30 * 60 * 1000),
          minPrice: '',
          monadForSale: '',
        });
      }
    } catch (error) {
      console.error('Error creating pool:', error);
      toast.error('Failed to create pool. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Pool"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monad Token Address is fixed */}
          {/* Seller Address comes from connected wallet */}
          
          {/* End Time */}
          <div>
            <Input
              label="End Time"
              type="datetime-local"
              value={form.endTime.toISOString().slice(0, 16)}
              onChange={(e) => setForm({ ...form, endTime: new Date(e.target.value) })}
              error={errors.endTime}
              icon={<Calendar className="h-4 w-4" />}
              helperText="When the commit phase ends"
            />
          </div>
          
          {/* Minimum Price */}
          <div>
            <Input
              label="Minimum Price (ETH)"
              type="number"
              step="0.001"
              placeholder="1.0"
              value={form.minPrice}
              onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
              error={errors.minPrice}
              icon={<DollarSign className="h-4 w-4" />}
              helperText="Minimum acceptable price per token"
            />
          </div>
          
          {/* Base Tokens for Sale */}
          <div className="md:col-span-2">
            <Input
              label="Monad Tokens for Sale"
              type="number"
              step="0.001"
              placeholder="100"
              value={form.monadForSale}
              onChange={(e) => setForm({ ...form, monadForSale: e.target.value })}
              error={errors.monadForSale}
              icon={<Coins className="h-4 w-4" />}
              helperText="Amount of Monad tokens you want to sell"
            />
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Pool Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monad Token:</span>
              <span className="font-mono text-sm">{form.monadToken}</span>
            </div>
            {address && (
              <div className="flex justify-between">
                <span className="text-gray-600">Seller Address (You):</span>
                <span className="font-mono text-sm">{address}</span>
              </div>
            )}
            {address && (
              <div className="flex justify-between">
                <span className="text-gray-600">Your Monad Balance:</span>
                <span className={`font-mono text-sm ${monadBalance && form.monadForSale && parseFloat(form.monadForSale) > parseFloat(monadBalance) ? 'text-red-600' : 'text-green-600'}`}>
                  {isBalanceLoading ? 'Loading...' : monadBalance ? `${monadBalance} tokens` : '0 tokens'}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">End Time:</span>
              <span>{form.endTime.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Min Price:</span>
              <span>{form.minPrice ? `${form.minPrice} ETH` : 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">For Sale:</span>
              <span>{form.monadForSale || 'Not specified'} tokens</span>
            </div>
            {form.minPrice && form.monadForSale && (
              <div className="flex justify-between font-semibold border-t pt-3">
                <span>Total Value:</span>
                <span>{(parseFloat(form.minPrice) * parseFloat(form.monadForSale)).toFixed(4)} ETH</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            loading={isLoading || isApproving || isCreatingPool}
            disabled={!address || isApproving || isCreatingPool || isBalanceLoading || !!(monadBalance && form.monadForSale && parseFloat(form.monadForSale) > parseFloat(monadBalance))}
            className="flex-1"
            icon={<Plus className="h-4 w-4" />}
          >
            {isApproving ? 'Approving Tokens...' : isCreatingPool ? 'Creating Pool...' : 'Create Pool'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
        
        {!address && (
          <p className="text-sm text-red-600 text-center">
            Please connect your wallet to create a pool
          </p>
        )}
        {address && monadBalance && form.monadForSale && parseFloat(form.monadForSale) > parseFloat(monadBalance) && (
          <p className="text-sm text-red-600 text-center">
            Insufficient Monad balance. You need {form.monadForSale} tokens but only have {monadBalance}.
          </p>
        )}
      </form>
    </Modal>
  );
};

