
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
  const [sortBy, setSortBy] = useState('newest');

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
            <MarketplaceFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <MarketplaceSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <MarketplaceSorting sortBy={sortBy} onSortChange={setSortBy} />
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
