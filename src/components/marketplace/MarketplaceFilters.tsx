
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, Brain, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface MarketplaceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRarity: string;
  setSelectedRarity: (rarity: string) => void;
  selectedCondition: string;
  setSelectedCondition: (condition: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showAuctionsOnly: boolean;
  setShowAuctionsOnly: (show: boolean) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (show: boolean) => void;
  clearFilters: () => void;
  filteredCount: number;
  isLoading: boolean;
  auctionsCount: number;
  featuredCount: number;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedRarity,
  setSelectedRarity,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showAuctionsOnly,
  setShowAuctionsOnly,
  showFeaturedOnly,
  setShowFeaturedOnly,
  clearFilters,
  filteredCount,
  isLoading,
  auctionsCount,
  featuredCount
}) => {
  const [aiSearchEnabled, setAiSearchEnabled] = useState(false);

  // Phase 3: AI-Powered Search Suggestions from Admin Brain
  const { data: aiSearchFilters } = useQuery({
    queryKey: ['ai-search-filters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_search_filters')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false })
        .limit(5);

      if (error) {
        console.error('❌ Error fetching AI search filters:', error);
        return [];
      }

      return data || [];
    },
    enabled: aiSearchEnabled
  });
  const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];
  const conditionOptions = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair', 'Poor'];

  const hasActiveFilters = searchTerm || selectedRarity || selectedCondition || showAuctionsOnly || showFeaturedOnly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="glass-card p-8 rounded-3xl mb-12 border-2 border-white/30 shadow-2xl"
    >
      {/* Enhanced Search bar with AI */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-brand-primary w-6 h-6 z-10" />
        <input
          type="text"
          placeholder={aiSearchEnabled ? "AI-powered search with smart suggestions..." : "Search coins, years, countries, or descriptions..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-modern pl-16 pr-16 text-lg h-14 shadow-xl"
        />
        <Button
          onClick={() => setAiSearchEnabled(!aiSearchEnabled)}
          size="sm"
          variant={aiSearchEnabled ? "default" : "outline"}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10"
        >
          <Brain className="w-4 h-4 mr-1" />
          AI
        </Button>
      </div>

      {/* Phase 3: AI Search Suggestions */}
      {aiSearchEnabled && aiSearchFilters && aiSearchFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">AI Smart Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSearchFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm(filter.filter_name)}
                className="text-xs border-blue-300 hover:bg-blue-100"
              >
                {filter.filter_name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

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
          {auctionsCount > 0 && (
            <Badge className="ml-2 bg-white/20 text-current">{auctionsCount}</Badge>
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
          {featuredCount > 0 && (
            <Badge className="ml-2 bg-white/20 text-current">{featuredCount}</Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Rarity</label>
          <Select value={selectedRarity} onValueChange={setSelectedRarity}>
            <SelectTrigger className="input-modern h-12">
              <SelectValue placeholder="All Rarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Rarities</SelectItem>
              {rarityOptions.map(rarity => (
                <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Condition</label>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger className="input-modern h-12">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Conditions</SelectItem>
              {conditionOptions.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="input-modern h-12">
              <SelectValue />
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
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-bold text-gray-700">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={10000}
          min={0}
          step={100}
          className="w-full"
        />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-6 border-t border-white/20">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-gray-800">
            {isLoading ? 'Loading...' : `${filteredCount} coins found`}
          </span>
          {hasActiveFilters && (
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
  );
};

export default MarketplaceFilters;
