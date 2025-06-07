
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Grid, List } from 'lucide-react';

interface ActiveMarketplaceFiltersProps {
  selectedCondition: string;
  setSelectedCondition: (value: string) => void;
  selectedRarity: string;
  setSelectedRarity: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  showAuctionsOnly: boolean;
  setShowAuctionsOnly: (value: boolean) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (value: boolean) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchTerm: string;
  clearFilters: () => void;
}

const ActiveMarketplaceFilters: React.FC<ActiveMarketplaceFiltersProps> = ({
  selectedCondition,
  setSelectedCondition,
  selectedRarity,
  setSelectedRarity,
  sortBy,
  setSortBy,
  showAuctionsOnly,
  setShowAuctionsOnly,
  showFeaturedOnly,
  setShowFeaturedOnly,
  viewMode,
  setViewMode,
  searchTerm,
  clearFilters
}) => {
  const hasActiveFilters = searchTerm || selectedCondition || selectedRarity || showAuctionsOnly || showFeaturedOnly;

  return (
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

        {hasActiveFilters && (
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
  );
};

export default ActiveMarketplaceFilters;
