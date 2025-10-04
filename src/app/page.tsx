'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Zap, 
  Shield, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/market');
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'MEV Resistant',
      description: 'Commit-reveal mechanism prevents front-running and MEV attacks',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Fair Price Discovery',
      description: 'Uniform clearing price ensures fair allocation for all participants',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Parallel Execution',
      description: 'Finalize multiple pools simultaneously leveraging Monad\'s speed',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Transparent Process',
      description: 'All bids and allocations are publicly verifiable on-chain',
    },
  ];

  const stats = [
    { label: 'Active Pools', value: '12' },
    { label: 'Total Volume', value: '$2.4M' },
    { label: 'Participants', value: '1,247' },
    { label: 'Success Rate', value: '98.5%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-primary-800/5" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="info" className="mb-6">
              <Star className="h-3 w-3 mr-1" />
              Now Live on Monad Testnet
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Parallel</span>
              <br />
              <span className="text-gray-900">Auctions</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of decentralized trading with commit-reveal batch auctions. 
              Fair, fast, and MEV-resistant price discovery on Monad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="xl" 
                onClick={handleGetStarted}
                icon={<ArrowRight className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                Start Trading
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                icon={<Globe className="h-5 w-5" />}
                className="w-full sm:w-auto"
              >
                View Docs
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Parallel Auctions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Monad's high-performance blockchain with cutting-edge auction mechanisms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple three-step process for fair and transparent trading
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Commit
              </h3>
              <p className="text-gray-600">
                Submit your bid hash with amount and price. Your actual bid remains secret until reveal phase.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reveal
              </h3>
              <p className="text-gray-600">
                Reveal your actual bid and deposit ETH. All bids are now public and verifiable.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Finalize
              </h3>
              <p className="text-gray-600">
                System determines clearing price and allocates tokens. Excess ETH is refunded automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of traders already using Parallel Auctions for fair and efficient price discovery.
          </p>
          <Button 
            size="xl" 
            variant="secondary"
            onClick={handleGetStarted}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Start Trading Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Monad Auctions</span>
              </div>
              <p className="text-gray-400">
                The future of decentralized trading is here.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Market</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Monad Parallel Auctions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

