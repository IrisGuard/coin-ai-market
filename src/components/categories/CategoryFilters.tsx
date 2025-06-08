
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { X, Filter, Search, Grid, List, Calendar, DollarSign } from 'lucide-react';

interface CategoryFiltersProps {
  category: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  yearRange: [number, number];
  setYearRange: (value: [number, number]) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedCondition: string;
  setSelectedCondition: (value: string) => void;
  selectedRarity: string;
  setSelectedRarity: (value: string) => void;
  showAuctionsOnly: boolean;
  setShowAuctionsOnly: (value: boolean) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (value: boolean) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  category,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  yearRange,
  setYearRange,
  selectedCountry,
  setSelectedCountry,
  selectedCondition,
  setSelectedCondition,
  selectedRarity,
  setSelectedRarity,
  showAuctionsOnly,
  setShowAuctionsOnly,
  showFeaturedOnly,
  setShowFeaturedOnly,
  viewMode,
  setViewMode,
  clearAllFilters,
  activeFiltersCount
}) => {
  const getCategorySpecificFilters = () => {
    switch (category) {
      case 'ancient':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year Range (Ancient Era)</label>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{yearRange[0]} AD</span>
                <span>{yearRange[1]} AD</span>
              </div>
            </div>
          </>
        );
      case 'modern':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year Range (Modern Era)</label>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                max={2024}
                min={1900}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
              </div>
            </div>
          </>
        );
      case 'gold':
      case 'silver':
        return (
          <>
            <Select value={selectedRarity || 'all'} onValueChange={(value) => setSelectedRarity(value === 'all' ? '' : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Purity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Purities</SelectItem>
                <SelectItem value="24k">24K Gold</SelectItem>
                <SelectItem value="22k">22K Gold</SelectItem>
                <SelectItem value="18k">18K Gold</SelectItem>
                <SelectItem value="925">925 Silver</SelectItem>
                <SelectItem value="999">999 Silver</SelectItem>
              </SelectContent>
            </Select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search and View Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${category} coins...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-electric-blue text-white' : ''}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-electric-blue text-white' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="year-new">Year: Newest</SelectItem>
            <SelectItem value="year-old">Year: Oldest</SelectItem>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="rarity">By Rarity</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCondition || 'all'} onValueChange={(value) => setSelectedCondition(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
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

        <Select value={selectedRarity || 'all'} onValueChange={(value) => setSelectedRarity(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="Common">Common</SelectItem>
            <SelectItem value="Uncommon">Uncommon</SelectItem>
            <SelectItem value="Rare">Rare</SelectItem>
            <SelectItem value="Very Rare">Very Rare</SelectItem>
            <SelectItem value="Extremely Rare">Extremely Rare</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCountry || 'all'} onValueChange={(value) => setSelectedCountry(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
          </SelectContent>
        </Select>

        {/* Category-specific filters */}
        {getCategorySpecificFilters()}
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>

        {category !== 'ancient' && category !== 'modern' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Year Range: {yearRange[0]} - {yearRange[1]}
            </label>
            <Slider
              value={yearRange}
              onValueChange={setYearRange}
              max={2024}
              min={1800}
              step={10}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Toggle Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-4">
        <div className="flex items-center space-x-2">
          <Switch checked={showAuctionsOnly} onCheckedChange={setShowAuctionsOnly} />
          <label className="text-sm font-medium text-electric-orange">Live Auctions Only</label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={showFeaturedOnly} onCheckedChange={setShowFeaturedOnly} />
          <label className="text-sm font-medium text-electric-purple">Featured Only</label>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-electric-red hover:text-electric-orange flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;
