
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ThemeAwareMarketplaceFiltersProps {
  filters: any;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  filterOptions: any;
  totalResults: number;
  hasActiveFilters: boolean;
  isLoading: boolean;
  auctionsCount: number;
  featuredCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  stats: {
    total: number;
    auctions: number;
    featured: number;
    totalValue: number;
  };
}

const ThemeAwareMarketplaceFilters: React.FC<ThemeAwareMarketplaceFiltersProps> = ({
  filters,
  updateFilter,
  clearFilters,
  totalResults,
  hasActiveFilters,
  auctionsCount,
  featuredCount,
  viewMode,
  setViewMode,
  stats
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30 dark:border-gray-700/30 shadow-xl"
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Αναζήτηση νομισμάτων, χρονολογιών, χωρών..."
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="pl-12 h-12 text-lg bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant={filters.showAuctionsOnly ? "default" : "outline"}
          onClick={() => updateFilter('showAuctionsOnly', !filters.showAuctionsOnly)}
          className="flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Δημοπρασίες ({auctionsCount})
        </Button>
        <Button
          variant={filters.showFeaturedOnly ? "default" : "outline"}
          onClick={() => updateFilter('showFeaturedOnly', !filters.showFeaturedOnly)}
          className="flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Προτεινόμενα ({featuredCount})
        </Button>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-gray-600 dark:text-gray-400"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Καθαρισμός Φίλτρων
          </Button>
        )}
      </div>

      {/* Results and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Εμφάνιση <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> νομισμάτων
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Φίλτρα ενεργά
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
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
  );
};

export default ThemeAwareMarketplaceFilters;
