'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RevealForm } from '@/types';
import { Eye, Coins, DollarSign, Hash, AlertTriangle } from 'lucide-react';
import { calculateEthAmount } from '@/lib/utils';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface RevealBidFormProps {
  poolId: number;
  minPrice: string;
}

export const RevealBidForm = ({ poolId, minPrice }: RevealBidFormProps) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<RevealForm>({
    amountMonad: '',
    price: '',
    salt: '',
    ethAmount: '',
  });

  const [errors, setErrors] = useState<Partial<RevealForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RevealForm> = {};

    if (!form.amountMonad) {
      newErrors.amountMonad = 'Amount is required';
    } else if (parseFloat(form.amountMonad) <= 0) {
      newErrors.amountMonad = 'Amount must be greater than 0';
    }

    if (!form.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(form.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (parseFloat(form.price) < parseFloat(minPrice) / 1e18) {
      newErrors.price = `Price must be at least ${parseFloat(minPrice) / 1e18} ETH`;
    }

    if (!form.salt) {
      newErrors.salt = 'Salt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRequiredEth = () => {
    if (!form.amountMonad || !form.price) {
      setForm({ ...form, ethAmount: '' });
      return;
    }

    try {
      const amountMonadWei = ethers.parseUnits(form.amountMonad, 18);
      const priceWei = ethers.parseUnits(form.price, 18);
      const ethAmount = calculateEthAmount(amountMonadWei.toString(), priceWei.toString());
      setForm({ ...form, ethAmount: ethers.formatEther(ethAmount) });
    } catch (error) {
      console.error('Error calculating ETH amount:', error);
      setForm({ ...form, ethAmount: '' });
    }
  };

  // Auto-calculate ETH amount when amount or price changes
  useState(() => {
    calculateRequiredEth();
  });

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

    setIsLoading(true);
    
    try {
      // TODO: Implement contract interaction with ETH value
      const ethValue = ethers.parseEther(form.ethAmount);
      
      console.log('Revealing bid:', {
        poolId,
        amountMonad: form.amountMonad,
        price: form.price,
        salt: form.salt,
        ethValue: ethValue.toString(),
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Bid revealed successfully!');
      
      // Reset form
      setForm({
        amountMonad: '',
        price: '',
        salt: '',
        ethAmount: '',
      });
    } catch (error) {
      console.error('Error revealing bid:', error);
      toast.error('Failed to reveal bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-yellow-600" />
          Reveal Your Bid
        </CardTitle>
        <p className="text-sm text-gray-600">
          Reveal your actual bid and deposit ETH. Make sure the values match your commit.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount Base */}
            <div>
              <Input
                label="Amount (Monad Tokens)"
                type="number"
                step="0.001"
                placeholder="100"
                value={form.amountMonad}
                onChange={(e) => setForm({ ...form, amountMonad: e.target.value })}
                error={errors.amountMonad}
                icon={<Coins className="h-4 w-4" />}
                helperText="Must match your committed amount"
              />
            </div>
            
            {/* Price */}
            <div>
              <Input
                label="Price (ETH per Token)"
                type="number"
                step="0.001"
                placeholder="1.5"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                error={errors.price}
                icon={<DollarSign className="h-4 w-4" />}
                helperText={`Minimum: ${parseFloat(minPrice) / 1e18} ETH`}
              />
            </div>
          </div>

          {/* Salt */}
          <div>
            <Input
              label="Salt (Random String)"
              placeholder="Enter the same salt from your commit"
              value={form.salt}
              onChange={(e) => setForm({ ...form, salt: e.target.value })}
              error={errors.salt}
              icon={<Hash className="h-4 w-4" />}
              helperText="Must match your committed salt exactly"
            />
          </div>

          {/* ETH Amount Display */}
          {form.ethAmount && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-900">Required ETH Deposit</h4>
                </div>
                <div className="text-2xl font-bold text-yellow-800">
                  {form.ethAmount} ETH
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This exact amount will be sent with your transaction
                </p>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {form.amountMonad && form.price && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Reveal Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{form.amountMonad} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{form.price} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total ETH:</span>
                    <span className="font-medium">{form.ethAmount} ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            loading={isLoading}
            disabled={!address || !form.ethAmount}
            className="w-full"
            icon={<Eye className="h-4 w-4" />}
          >
            {isLoading ? 'Revealing Bid...' : `Reveal Bid & Send ${form.ethAmount || '0'} ETH`}
          </Button>
          
          {!address && (
            <p className="text-sm text-red-600 text-center">
              Please connect your wallet to reveal your bid
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

