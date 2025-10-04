'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatAddress, formatPrice, formatTokenAmount } from '@/lib/utils';
import { Bid } from '@/types';
import { 
  TrendingUp, 
  TrendingDown, 
  User, 
  Coins, 
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface BidsTableProps {
  poolId: number;
  bids: Bid[];
  clearingPrice?: string;
  userAddress?: string | null;
}

interface BidWithStatus extends Bid {
  status: 'WINNER' | 'LOSER' | 'PARTIAL';
  allocated?: string;
  refund?: string;
}

export const BidsTable = ({ poolId, bids, clearingPrice, userAddress }: BidsTableProps) => {
  const [sortField, setSortField] = useState<'price' | 'amount'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data - gerçek uygulamada contract'tan çekilecek
  const mockBids: BidWithStatus[] = [
    {
      user: '0x1234567890123456789012345678901234567890',
      amountMonad: '50000000000000000000', // 50 tokens
      price: '2500000000000000000', // 2.5 ETH
      status: 'WINNER',
      allocated: '50000000000000000000', // 50 tokens
      refund: '25000000000000000000', // 25 ETH refund
    },
    {
      user: '0x2345678901234567890123456789012345678901',
      amountMonad: '60000000000000000000', // 60 tokens
      price: '2000000000000000000', // 2.0 ETH
      status: 'PARTIAL',
      allocated: '50000000000000000000', // 50 tokens (partial)
      refund: '20000000000000000000', // 20 ETH refund
    },
    {
      user: '0x3456789012345678901234567890123456789012',
      amountMonad: '20000000000000000000', // 20 tokens
      price: '1800000000000000000', // 1.8 ETH
      status: 'LOSER',
      allocated: '0',
      refund: '36000000000000000000', // 36 ETH refund
    },
    {
      user: '0x4567890123456789012345678901234567890123',
      amountMonad: '50000000000000000000', // 50 tokens
      price: '1500000000000000000', // 1.5 ETH
      status: 'LOSER',
      allocated: '0',
      refund: '75000000000000000000', // 75 ETH refund
    },
  ];

  const sortedBids = [...mockBids].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    if (sortField === 'price') {
      aValue = a.price;
      bValue = b.price;
    } else {
      aValue = a.amountMonad;
      bValue = b.amountMonad;
    }

    const comparison = BigInt(aValue) > BigInt(bValue) ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'price' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WINNER':
        return <Badge variant="success">Winner</Badge>;
      case 'PARTIAL':
        return <Badge variant="warning">Partial</Badge>;
      case 'LOSER':
        return <Badge variant="default">Loser</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  const getSortIcon = (field: 'price' | 'amount') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-primary-600" /> : 
      <ArrowDown className="h-4 w-4 text-primary-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Bids Table
        </CardTitle>
        <p className="text-sm text-gray-600">
          All revealed bids sorted by price (highest first)
        </p>
      </CardHeader>
      
      <CardContent>
        {clearingPrice && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Clearing Price</h3>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {formatPrice(clearingPrice)} ETH
            </p>
            <p className="text-sm text-green-700">
              All winning bids pay this price regardless of their bid price
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Bidder
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Amount
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Bid Price
                    {getSortIcon('price')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Allocated
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Refund
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBids.map((bid, index) => (
                <tr 
                  key={bid.user} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    userAddress && userAddress !== null && bid.user.toLowerCase() === userAddress.toLowerCase() 
                      ? 'bg-blue-50' 
                      : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-mono text-sm">
                          {formatAddress(bid.user)}
                        </p>
                        {userAddress && userAddress !== null && bid.user.toLowerCase() === userAddress.toLowerCase() && (
                          <Badge variant="info" size="sm">You</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {formatTokenAmount(bid.amountMonad)} tokens
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {formatPrice(bid.price)} ETH
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(bid.status)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {bid.allocated ? formatTokenAmount(bid.allocated) : '0'} tokens
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-green-600">
                      {bid.refund ? formatPrice(bid.refund) : '0'} ETH
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedBids.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Bids Yet
            </h3>
            <p className="text-gray-600">
              Bids will appear here once the reveal phase begins
            </p>
          </div>
        )}

        {/* Summary Stats */}
        {sortedBids.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{sortedBids.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Winning Bids</p>
              <p className="text-2xl font-bold text-green-600">
                {sortedBids.filter(b => b.status === 'WINNER' || b.status === 'PARTIAL').length}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(
                  sortedBids.reduce((sum, bid) => {
                    const allocated = bid.allocated || '0';
                    const clearingPriceBigInt = clearingPrice ? BigInt(clearingPrice) : BigInt(0);
                    return sum + (BigInt(allocated) * clearingPriceBigInt);
                  }, BigInt(0)).toString()
                )} ETH
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

