
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, Grid3X3, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';

interface ThemeAwareMarketplaceFiltersProps {
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
  auctionsCount: number;
  featuredCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  stats: {
    auctions: number;
    featured: number;
  };
}

const ThemeAwareMarketplaceFilters: React.FC<ThemeAwareMarketplaceFiltersProps> = ({
  filters,
  updateFilter,
  clearFilters,
  filterOptions,
  totalResults,
  hasActiveFilters,
  isLoading,
  auctionsCount,
  featuredCount,
  viewMode,
  setViewMode,
  stats
}) => {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl shadow-xl border border-gray-200 dark:border-white/20 p-6 mb-8"
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-primary w-5 h-5" />
        <Input
          type="text"
          placeholder={t('marketplace.search.placeholder')}
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="pl-12 pr-4 py-3 text-lg rounded-xl border-gray-200 dark:border-white/20 focus:border-brand-primary focus:ring-brand-primary bg-white/50 dark:bg-white/10"
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

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="auctions"
            checked={filters.showAuctionsOnly}
            onCheckedChange={(checked) => updateFilter('showAuctionsOnly', checked)}
          />
          <Label htmlFor="auctions" className="flex items-center cursor-pointer">
            <Clock className="w-4 h-4 mr-1 text-brand-accent" />
            {t('marketplace.filters.liveAuctions')}
            {stats.auctions > 0 && (
              <Badge className="ml-2 bg-brand-accent/10 text-brand-accent">{stats.auctions}</Badge>
            )}
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
            {t('marketplace.filters.featuredOnly')}
            {stats.featured > 0 && (
              <Badge className="ml-2 bg-coin-gold/10 text-coin-gold">{stats.featured}</Badge>
            )}
          </Label>
        </div>
      </div>

      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {/* Condition Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('marketplace.filters.condition')}</Label>
          <Select value={filters.selectedCondition} onValueChange={(value) => updateFilter('selectedCondition', value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder={t('marketplace.filters.allConditions')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('marketplace.filters.allConditions')}</SelectItem>
              {filterOptions.conditions.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country</Label>
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
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('marketplace.filters.sortBy')}</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('sort.newest')}</SelectItem>
              <SelectItem value="popularity">{t('sort.popularity')}</SelectItem>
              <SelectItem value="price-low">{t('sort.priceLow')}</SelectItem>
              <SelectItem value="price-high">{t('sort.priceHigh')}</SelectItem>
              <SelectItem value="year-old">{t('sort.yearOld')}</SelectItem>
              <SelectItem value="year-new">{t('sort.yearNew')}</SelectItem>
              <SelectItem value="name">{t('sort.name')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('marketplace.filters.display')}</Label>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex-1"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('marketplace.filters.actions')}</Label>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {t('marketplace.filters.clearFilters')}
            </Button>
          )}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-4 mb-6">
        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/20">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {isLoading ? t('marketplace.filters.loading') : `${totalResults} ${t('marketplace.filters.coinsFound')}`}
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {Object.values(filters).filter(v => v && v !== '' && JSON.stringify(v) !== JSON.stringify([0, 10000])).length} filters active
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeAwareMarketplaceFilters;
