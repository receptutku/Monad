'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CommitForm } from '@/types';
import { Lock, Coins, DollarSign, Hash, Copy, Check } from 'lucide-react';
import { generateSalt, calculateEthAmount } from '@/lib/utils';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface CommitBidFormProps {
  poolId: number;
  minPrice: string;
}

export const CommitBidForm = ({ poolId, minPrice }: CommitBidFormProps) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [form, setForm] = useState<CommitForm>({
    amountMonad: '',
    price: '',
    salt: generateSalt(),
    hash: '',
  });

  const [errors, setErrors] = useState<Partial<CommitForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CommitForm> = {};

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

  const generateHash = () => {
    if (!form.amountMonad || !form.price || !form.salt) {
      return;
    }

    try {
      const amountMonadWei = ethers.parseUnits(form.amountMonad, 18);
      const priceWei = ethers.parseUnits(form.price, 18);
      const saltBytes = ethers.toUtf8Bytes(form.salt);
      
      const hash = ethers.solidityPackedKeccak256(
        ['uint256', 'uint256', 'bytes32'],
        [amountMonadWei, priceWei, saltBytes]
      );
      
      setForm({ ...form, hash });
    } catch (error) {
      console.error('Error generating hash:', error);
      toast.error('Error generating hash');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const generateNewSalt = () => {
    const newSalt = generateSalt();
    setForm({ ...form, salt: newSalt, hash: '' });
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

    if (!form.hash) {
      toast.error('Please generate hash first');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement contract interaction
      console.log('Committing bid:', {
        poolId,
        hash: form.hash,
        amountMonad: form.amountMonad,
        price: form.price,
        salt: form.salt,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Bid committed successfully!');
      
      // Reset form
      setForm({
        amountMonad: '',
        price: '',
        salt: generateSalt(),
        hash: '',
      });
    } catch (error) {
      console.error('Error committing bid:', error);
      toast.error('Failed to commit bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ethAmount = form.amountMonad && form.price 
    ? calculateEthAmount(
        ethers.parseUnits(form.amountMonad, 18).toString(),
        ethers.parseUnits(form.price, 18).toString()
      )
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-600" />
          Commit Your Bid
        </CardTitle>
        <p className="text-sm text-gray-600">
          Submit a hash of your bid. Your actual bid remains secret until reveal phase.
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
                onChange={(e) => setForm({ ...form, amountMonad: e.target.value, hash: '' })}
                error={errors.amountMonad}
                icon={<Coins className="h-4 w-4" />}
                helperText="Amount of Monad tokens you want to buy"
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
                onChange={(e) => setForm({ ...form, price: e.target.value, hash: '' })}
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
              placeholder="Random string for uniqueness"
              value={form.salt}
              onChange={(e) => setForm({ ...form, salt: e.target.value, hash: '' })}
              error={errors.salt}
              icon={<Hash className="h-4 w-4" />}
              helperText="Random string to ensure bid uniqueness"
            />
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateNewSalt}
              >
                Generate New Salt
              </Button>
            </div>
          </div>

          {/* Hash Generation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Bid Hash
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateHash}
                disabled={!form.amountMonad || !form.price || !form.salt}
              >
                Generate Hash
              </Button>
            </div>
            
            {form.hash && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-800 break-all">
                    {form.hash}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(form.hash)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {form.amountMonad && form.price && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Bid Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Amount:</span>
                    <span className="font-medium">{form.amountMonad} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Price:</span>
                    <span className="font-medium">{form.price} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total ETH:</span>
                    <span className="font-medium">{ethers.formatEther(ethAmount)} ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            loading={isLoading}
            disabled={!address || !form.hash}
            className="w-full"
            icon={<Lock className="h-4 w-4" />}
          >
            {isLoading ? 'Committing Bid...' : 'Commit Bid'}
          </Button>
          
          {!address && (
            <p className="text-sm text-red-600 text-center">
              Please connect your wallet to commit a bid
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

