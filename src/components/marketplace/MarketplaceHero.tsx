
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCoins } from '@/hooks/useCoins';

const MarketplaceHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { data: coins } = useCoins();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/marketplace');
    }
  };

  // Calculate live stats
  const totalCoins = coins?.length || 0;
  const activeAuctions = coins?.filter(coin => coin.is_auction)?.length || 0;
  const featuredCoins = coins?.filter(coin => coin.featured)?.length || 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Main Heading */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Unique <span className="text-blue-600">Coins</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find rare and collectible coins from trusted sellers worldwide
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search for coins, years, countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-white border-2 border-gray-200 focus:border-blue-400 rounded-xl shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 h-10 px-6 bg-blue-600 hover:bg-blue-700"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalCoins.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Coins Available</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{activeAuctions}</div>
              <div className="text-sm text-gray-600">Live Auctions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">45,729</div>
              <div className="text-sm text-gray-600">Collectors</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{featuredCoins}</div>
              <div className="text-sm text-gray-600">Featured Items</div>
            </motion.div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Ancient Coins', 'Modern Coins', 'Error Coins', 'Graded Coins', 'Auctions'].map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                onClick={() => navigate(`/marketplace?category=${tag.toLowerCase().replace(' ', '-')}`)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm hover:shadow-md"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
