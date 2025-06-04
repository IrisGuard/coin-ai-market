
import React, { useState } from 'react';
import { useCoins } from '@/hooks/useCoins';
import Navbar from '@/components/Navbar';
import CoinGrid from '@/components/CoinGrid';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import MarketplaceSorting from '@/components/marketplace/MarketplaceSorting';
import MarketplaceSearch from '@/components/marketplace/MarketplaceSearch';
import { motion } from 'framer-motion';

const Marketplace = () => {
  const { data: coins = [], isLoading } = useCoins();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rarity: '',
    condition: '',
    priceRange: [0, 10000] as [number, number],
    year: '',
    country: '',
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'year-old' | 'year-new' | 'name'>('newest');

  // Filter and sort coins
  const filteredCoins = coins
    .filter((coin) => {
      const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          coin.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = !filters.rarity || coin.rarity === filters.rarity;
      const matchesCondition = !filters.condition || coin.condition === filters.condition;
      const matchesPrice = coin.price >= filters.priceRange[0] && coin.price <= filters.priceRange[1];
      const matchesYear = !filters.year || coin.year.toString().includes(filters.year);
      const matchesCountry = !filters.country || coin.country?.toLowerCase().includes(filters.country.toLowerCase());

      return matchesSearch && matchesRarity && matchesCondition && matchesPrice && matchesYear && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'year-old':
          return a.year - b.year;
        case 'year-new':
          return b.year - a.year;
        case 'name':
          return a.name.localeCompare(b.name);
        default: // newest
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Coin Marketplace</h1>
          <p className="text-gray-600">Discover, buy, and sell authenticated coins from collectors worldwide</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              {/* Simplified filters for now */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                  <select 
                    value={filters.rarity} 
                    onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Rarities</option>
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Ultra Rare">Ultra Rare</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-3 border border-gray-300 rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-old">Year: Oldest First</option>
                <option value="year-new">Year: Newest First</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${filteredCoins.length} coins found`}
            </div>

            {/* Coins Grid */}
            <CoinGrid coins={filteredCoins} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
