
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, Calendar, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EnhancedMarketplaceFiltersProps {
  filters: any;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  filterOptions: {
    rarities: string[];
    conditions: string[];
    countries: string[];
  };
  totalResults: number;
  hasActiveFilters: boolean;
  isLoading: boolean;
}

const EnhancedMarketplaceFilters: React.FC<EnhancedMarketplaceFiltersProps> = ({
  filters,
  updateFilter,
  clearFilters,
  filterOptions,
  totalResults,
  hasActiveFilters,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search coins by name, country, description, or year..."
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="pl-12 pr-4 py-3 text-lg rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
        />
        {filters.searchTerm && (
          <button
            onClick={() => updateFilter('searchTerm', '')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="auctions"
            checked={filters.showAuctionsOnly}
            onCheckedChange={(checked) => updateFilter('showAuctionsOnly', checked)}
          />
          <Label htmlFor="auctions" className="flex items-center cursor-pointer">
            <Clock className="w-4 h-4 mr-1 text-brand-accent" />
            Live Auctions
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={filters.showFeaturedOnly}
            onCheckedChange={(checked) => updateFilter('showFeaturedOnly', checked)}
          />
          <Label htmlFor="featured" className="flex items-center cursor-pointer">
            <Star className="w-4 h-4 mr-1 text-coin-gold" />
            Featured Only
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="recent"
            checked={filters.showRecentlyAdded}
            onCheckedChange={(checked) => updateFilter('showRecentlyAdded', checked)}
          />
          <Label htmlFor="recent" className="flex items-center cursor-pointer">
            <Calendar className="w-4 h-4 mr-1 text-green-500" />
            Recently Added
          </Label>
        </div>
      </div>

      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Rarity Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Rarity</Label>
          <Select value={filters.selectedRarity} onValueChange={(value) => updateFilter('selectedRarity', value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="All Rarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Rarities</SelectItem>
              {filterOptions.rarities.map(rarity => (
                <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Condition</Label>
          <Select value={filters.selectedCondition} onValueChange={(value) => updateFilter('selectedCondition', value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Conditions</SelectItem>
              {filterOptions.conditions.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Country</Label>
          <Select value={filters.selectedCountry} onValueChange={(value) => updateFilter('selectedCountry', value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {filterOptions.countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="recently-added">Recently Added</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="year-old">Year: Oldest First</SelectItem>
              <SelectItem value="year-new">Year: Newest First</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-4 mb-6">
        <Label className="text-sm font-semibold text-gray-700">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value)}
          max={10000}
          min={0}
          step={50}
          className="w-full"
        />
      </div>

      {/* Year Range Slider */}
      <div className="space-y-4 mb-6">
        <Label className="text-sm font-semibold text-gray-700">
          Year Range: {filters.yearRange[0]} - {filters.yearRange[1]}
        </Label>
        <Slider
          value={filters.yearRange}
          onValueChange={(value) => updateFilter('yearRange', value)}
          max={new Date().getFullYear()}
          min={1800}
          step={1}
          className="w-full"
        />
      </div>

      {/* Minimum Views Filter */}
      <div className="space-y-4 mb-6">
        <Label className="text-sm font-semibold text-gray-700 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          Minimum Views: {filters.minViews}
        </Label>
        <Slider
          value={[filters.minViews]}
          onValueChange={(value) => updateFilter('minViews', value[0])}
          max={1000}
          min={0}
          step={10}
          className="w-full"
        />
      </div>

      {/* Results Summary and Clear Filters */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-800">
            {isLoading ? 'Loading...' : `${totalResults} coins found`}
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {Object.values(filters).filter(v => v && v !== '' && JSON.stringify(v) !== JSON.stringify([0, 10000]) && JSON.stringify(v) !== JSON.stringify([1800, new Date().getFullYear()])).length} filters active
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear All Filters
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedMarketplaceFilters;
