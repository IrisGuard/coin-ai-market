import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  Star, 
  Clock,
  TrendingUp,
  Eye,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedSearchInterfaceProps {
  onSearch: (searchParams: any) => void;
  searchResults: any[];
  isLoading: boolean;
}

const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({
  onSearch,
  searchResults,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStartTime, setSearchStartTime] = useState(Date.now());
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    yearRange: [1800, 2024],
    country: '',
    rarity: '',
    condition: '',
    mintMark: '',
    hasImage: true,
    isAuction: false,
    hasGrading: false,
    sortBy: 'relevance'
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearchStartTime(Date.now());
    const searchParams = {
      query: searchQuery,
      ...filters
    };
    onSearch(searchParams);
  };

  const clearFilter = (filterKey: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterKey.includes('Range') ? 
        (filterKey === 'priceRange' ? [0, 10000] : [1800, 2024]) : 
        ''
    }));
    setActiveFilters(prev => prev.filter(f => f !== filterKey));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      yearRange: [1800, 2024],
      country: '',
      rarity: '',
      condition: '',
      mintMark: '',
      hasImage: true,
      isAuction: false,
      hasGrading: false,
      sortBy: 'relevance'
    });
    setActiveFilters([]);
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search coins by name, year, country, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-xl border-gray-200 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-6 py-3"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Active Filters:</span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {filter}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => clearFilter(filter)}
                  />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Advanced Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasImage"
                    checked={filters.hasImage}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasImage: checked }))}
                  />
                  <Label htmlFor="hasImage" className="flex items-center cursor-pointer">
                    <Eye className="w-4 h-4 mr-1" />
                    Has Images
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAuction"
                    checked={filters.isAuction}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isAuction: checked }))}
                  />
                  <Label htmlFor="isAuction" className="flex items-center cursor-pointer">
                    <Clock className="w-4 h-4 mr-1" />
                    Auctions Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasGrading"
                    checked={filters.hasGrading}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasGrading: checked }))}
                  />
                  <Label htmlFor="hasGrading" className="flex items-center cursor-pointer">
                    <Star className="w-4 h-4 mr-1" />
                    Graded Coins
                  </Label>
                </div>
              </div>

              {/* Category Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Country
                  </Label>
                  <Select value={filters.country} onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rarity</Label>
                  <Select value={filters.rarity} onValueChange={(value) => setFilters(prev => ({ ...prev, rarity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Rarities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uncommon">Uncommon</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Very Rare">Very Rare</SelectItem>
                      <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={filters.condition} onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
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
                      <SelectItem value="Mint State">Mint State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Sort By
                  </Label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="year-old">Year: Oldest First</SelectItem>
                      <SelectItem value="year-new">Year: Newest First</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="recently-added">Recently Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="flex items-center justify-between">
                    Price Range
                    <span className="text-sm text-gray-500">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </span>
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                    max={10000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Year Range
                    </div>
                    <span className="text-sm text-gray-500">
                      {filters.yearRange[0]} - {filters.yearRange[1]}
                    </span>
                  </Label>
                  <Slider
                    value={filters.yearRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, yearRange: value }))}
                    max={2024}
                    min={1800}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleSearch}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Apply Filters & Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search Results Summary */}
      {searchResults && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {searchResults.length} results found
              </span>
              <Badge variant="outline" className="text-sm">
                Search completed in {((Date.now() - searchStartTime) / 1000).toFixed(2)}s
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearchInterface;
