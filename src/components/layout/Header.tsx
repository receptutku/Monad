'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '@/components/web3/WalletConnect';
import { NetworkStatus } from '@/components/web3/NetworkStatus';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Menu, X, TrendingUp, Zap } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/market');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Monad Auctions</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/market" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Market
            </Link>
            <Link 
              href="/pools" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Pools
            </Link>
            <Link 
              href="/docs" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Docs
            </Link>
            <Badge variant="info" size="sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              Testnet
            </Badge>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <NetworkStatus />
            <WalletConnect />
            <Button onClick={handleGetStarted} size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/market" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Market
              </Link>
              <Link 
                href="/pools" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pools
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <NetworkStatus />
                <WalletConnect />
              </div>
              <Button onClick={handleGetStarted} className="w-full">
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

