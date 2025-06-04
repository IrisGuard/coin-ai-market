
import React, { useState, useMemo } from 'react';
import { useCoins } from '@/hooks/useCoins';
import Navbar from '@/components/Navbar';
import CoinGrid from '@/components/CoinGrid';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid3x3, List, TrendingUp, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Marketplace = () => {
  const { data: coins = [], isLoading } = useCoins();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'year-old' | 'year-new' | 'name' | 'popularity'>('newest');
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort coins
  const filteredCoins = useMemo(() => {
    return coins
      .filter((coin) => {
        const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coin.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coin.country?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRarity = !selectedRarity || coin.rarity === selectedRarity;
        const matchesCondition = !selectedCondition || coin.condition === selectedCondition;
        const matchesPrice = coin.price >= priceRange[0] && coin.price <= priceRange[1];
        const matchesAuction = !showAuctionsOnly || coin.is_auction;
        const matchesFeatured = !showFeaturedOnly || coin.featured;

        return matchesSearch && matchesRarity && matchesCondition && matchesPrice && matchesAuction && matchesFeatured;
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
          case 'popularity':
            return (b.views || 0) + (b.favorites || 0) - ((a.views || 0) + (a.favorites || 0));
          default: // newest
            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        }
      });
  }, [coins, searchTerm, selectedRarity, selectedCondition, priceRange, sortBy, showAuctionsOnly, showFeaturedOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRarity('');
    setSelectedCondition('');
    setPriceRange([0, 10000]);
    setShowAuctionsOnly(false);
    setShowFeaturedOnly(false);
  };

  const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];
  const conditionOptions = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair', 'Poor'];

  const stats = {
    total: coins.length,
    auctions: coins.filter(c => c.is_auction).length,
    featured: coins.filter(c => c.featured).length,
    totalValue: coins.reduce((sum, coin) => sum + coin.price, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="container-padding section-spacing">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="section-heading mb-4">Coin Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Discover, buy, and sell authenticated coins from collectors worldwide. 
            Our AI-verified marketplace ensures authenticity and fair pricing.
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="stats-card text-center">
            <div className="text-3xl font-bold gradient-text">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Coins</div>
          </div>
          <div className="stats-card text-center">
            <div className="text-3xl font-bold text-vibrant-red">{stats.auctions}</div>
            <div className="text-sm text-gray-600 mt-1">Live Auctions</div>
          </div>
          <div className="stats-card text-center">
            <div className="text-3xl font-bold text-coin-gold">{stats.featured}</div>
            <div className="text-sm text-gray-600 mt-1">Featured</div>
          </div>
          <div className="stats-card text-center">
            <div className="text-3xl font-bold gradient-text">${stats.totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Total Value</div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glassmorphism p-6 rounded-2xl mb-8 border border-white/20 shadow-lg"
        >
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search coins, years, countries, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-vibrant-purple focus:border-transparent transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant={showAuctionsOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAuctionsOnly(!showAuctionsOnly)}
              className={showAuctionsOnly ? "bg-vibrant-red text-white" : ""}
            >
              <Clock className="w-4 h-4 mr-2" />
              Auctions Only
            </Button>
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={showFeaturedOnly ? "bg-coin-gold text-white" : ""}
            >
              <Star className="w-4 h-4 mr-2" />
              Featured
            </Button>
          </div>

          {/* Detailed Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
              >
                <option value="">All Rarities</option>
                {rarityOptions.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
              >
                <option value="">All Conditions</option>
                {conditionOptions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple"
              >
                <option value="newest">Newest First</option>
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-old">Year: Oldest First</option>
                <option value="year-new">Year: Newest First</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Results and View Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${filteredCoins.length} coins found`}
              {(searchTerm || selectedRarity || selectedCondition || showAuctionsOnly || showFeaturedOnly) && (
                <button
                  onClick={clearFilters}
                  className="ml-4 text-vibrant-purple hover:text-vibrant-blue transition-colors font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Coins Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CoinGrid coins={filteredCoins} loading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
};

export default Marketplace;
