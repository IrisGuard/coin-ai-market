import React, { useState, useMemo } from 'react';
import { useCoins } from '@/hooks/useCoins';
import { useTenant } from '@/contexts/TenantContext';
import Navbar from '@/components/Navbar';
import CoinGrid from '@/components/CoinGrid';
import TenantMarketplace from '@/components/tenant/TenantMarketplace';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid3x3, List, TrendingUp, Clock, Star, Sparkles, Target, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Marketplace = () => {
  const { currentTenant } = useTenant();
  
  // If we're in a tenant context, show the tenant marketplace
  if (currentTenant) {
    return (
      <div>
        <Navbar />
        <TenantMarketplace />
      </div>
    );
  }

  // Otherwise show the main marketplace with all the existing functionality
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
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-6">
              <Sparkles className="w-5 h-5 mr-3 text-brand-primary animate-pulse" />
              <span className="text-sm font-semibold text-brand-primary">AI-Verified Marketplace</span>
            </div>
            
            <h1 className="section-title mb-6">
              Global Coin Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Discover, buy, and sell authenticated coins from collectors worldwide. 
              Our AI-verified marketplace ensures authenticity and fair pricing.
            </p>
          </motion.div>

          {/* Enhanced Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              { 
                icon: <Target className="w-8 h-8" />, 
                value: stats.total, 
                label: "Total Coins", 
                color: "from-brand-primary to-electric-blue",
                bgColor: "from-brand-primary/10 to-electric-blue/10"
              },
              { 
                icon: <Clock className="w-8 h-8" />, 
                value: stats.auctions, 
                label: "Live Auctions", 
                color: "from-brand-accent to-electric-pink",
                bgColor: "from-brand-accent/10 to-electric-pink/10"
              },
              { 
                icon: <Star className="w-8 h-8" />, 
                value: stats.featured, 
                label: "Featured", 
                color: "from-coin-gold to-electric-orange",
                bgColor: "from-coin-gold/10 to-electric-orange/10"
              },
              { 
                icon: <DollarSign className="w-8 h-8" />, 
                value: `$${Math.round(stats.totalValue / 1000)}K`, 
                label: "Total Value", 
                color: "from-electric-emerald to-electric-teal",
                bgColor: "from-electric-emerald/10 to-electric-teal/10"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                className="stats-card text-center group hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgColor} border border-white/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-8 rounded-3xl mb-12 border-2 border-white/30 shadow-2xl"
          >
            {/* Search bar with enhanced styling */}
            <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-brand-primary w-6 h-6 z-10" />
              <input
                type="text"
                placeholder="Search coins, years, countries, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-16 text-lg h-14 shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-electric-blue/5 to-brand-accent/5 rounded-2xl -z-10"></div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                variant={showAuctionsOnly ? "default" : "outline"}
                size="lg"
                onClick={() => setShowAuctionsOnly(!showAuctionsOnly)}
                className={`brand-button-outline ${showAuctionsOnly ? 'bg-gradient-to-r from-brand-accent to-electric-pink text-white border-0' : ''}`}
              >
                <Clock className="w-5 h-5 mr-2" />
                Live Auctions
                {stats.auctions > 0 && (
                  <Badge className="ml-2 bg-white/20 text-current">{stats.auctions}</Badge>
                )}
              </Button>
              
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                size="lg"
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`brand-button-outline ${showFeaturedOnly ? 'bg-gradient-to-r from-coin-gold to-electric-orange text-white border-0' : ''}`}
              >
                <Star className="w-5 h-5 mr-2" />
                Featured Only
                {stats.featured > 0 && (
                  <Badge className="ml-2 bg-white/20 text-current">{stats.featured}</Badge>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Rarity</label>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="input-modern h-12"
                >
                  <option value="">All Rarities</option>
                  {rarityOptions.map(rarity => (
                    <option key={rarity} value={rarity}>{rarity}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="input-modern h-12"
                >
                  <option value="">All Conditions</option>
                  {conditionOptions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input-modern h-12"
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
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">View Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "outline"}
                    size="lg"
                    onClick={() => setViewMode('grid')}
                    className="flex-1 brand-button-outline"
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? "default" : "outline"}
                    size="lg"
                    onClick={() => setViewMode('list')}
                    className="flex-1 brand-button-outline"
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between pt-6 border-t border-white/20">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-800">
                  {isLoading ? 'Loading...' : `${filteredCoins.length} coins found`}
                </span>
                {(searchTerm || selectedRarity || selectedCondition || showAuctionsOnly || showFeaturedOnly) && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="brand-button-outline"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Coins Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <CoinGrid coins={filteredCoins} loading={isLoading} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
