
import React, { useState, useMemo } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceSearch from "@/components/marketplace/MarketplaceSearch";
import OptimizedCoinCard from "@/components/OptimizedCoinCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Grid, List, Filter } from 'lucide-react';

const ActiveMarketplace = () => {
  usePageView();
  usePerformanceMonitoring('ActiveMarketplace');
  
  const { coins, isLoading } = useCachedMarketplaceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort coins
  const filteredCoins = useMemo(() => {
    let filtered = [...coins];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name?.toLowerCase().includes(searchLower) ||
        coin.country?.toLowerCase().includes(searchLower) ||
        coin.description?.toLowerCase().includes(searchLower) ||
        coin.year?.toString().includes(searchTerm)
      );
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter(coin => coin.condition === selectedCondition);
    }

    // Rarity filter
    if (selectedRarity) {
      filtered = filtered.filter(coin => coin.rarity === selectedRarity);
    }

    // Auctions filter
    if (showAuctionsOnly) {
      filtered = filtered.filter(coin => coin.is_auction);
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(coin => coin.featured);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'year-old':
          return (a.year || 0) - (b.year || 0);
        case 'year-new':
          return (b.year || 0) - (a.year || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'newest':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [coins, searchTerm, selectedCondition, selectedRarity, sortBy, showAuctionsOnly, showFeaturedOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCondition('');
    setSelectedRarity('');
    setSortBy('newest');
    setShowAuctionsOnly(false);
    setShowFeaturedOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-4">
            Marketplace
          </h1>
          <p className="text-electric-green">
            Discover authentic coins from collectors worldwide
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <MarketplaceSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showAuctionsOnly}
                onCheckedChange={setShowAuctionsOnly}
              />
              <label className="text-sm font-medium text-electric-orange">Live Auctions Only</label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={showFeaturedOnly}
                onCheckedChange={setShowFeaturedOnly}
              />
              <label className="text-sm font-medium text-electric-purple">Featured Only</label>
            </div>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Conditions</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Very Good">Very Good</SelectItem>
                <SelectItem value="Fine">Fine</SelectItem>
                <SelectItem value="Very Fine">Very Fine</SelectItem>
                <SelectItem value="Extremely Fine">Extremely Fine</SelectItem>
                <SelectItem value="About Uncirculated">About Uncirculated</SelectItem>
                <SelectItem value="Uncirculated">Uncirculated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Rarities</SelectItem>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Uncommon">Uncommon</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Very Rare">Very Rare</SelectItem>
                <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="year-old">Year: Oldest First</SelectItem>
                <SelectItem value="year-new">Year: Newest First</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-electric-orange/10 border-electric-orange text-electric-orange' : 'text-electric-blue'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-electric-orange/10 border-electric-orange text-electric-orange' : 'text-electric-purple'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {(searchTerm || selectedCondition || selectedRarity || showAuctionsOnly || showFeaturedOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-electric-red hover:text-electric-orange"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-electric-green">
            Showing <span className="font-semibold text-electric-blue">{filteredCoins.length}</span> of <span className="font-semibold text-electric-purple">{coins.length}</span> coins
          </p>
        </div>

        {/* Coins Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
              <span className="text-electric-blue">Loading marketplace...</span>
            </div>
          </div>
        ) : filteredCoins.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-electric-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-4xl">🔍</div>
              </div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent mb-2">No coins found</h2>
              <p className="text-electric-blue mb-6">
                We couldn't find any coins matching your search criteria.
              </p>
              <Button onClick={clearFilters} className="bg-gradient-to-r from-electric-orange to-electric-red hover:from-electric-red hover:to-electric-orange text-white">
                Clear all filters
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "space-y-4"
          }>
            {filteredCoins.map((coin, index) => (
              <div key={coin.id} className="w-full">
                <OptimizedCoinCard coin={coin} index={index} priority={index < 10} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ActiveMarketplace;
