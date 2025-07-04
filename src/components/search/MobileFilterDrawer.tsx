import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, RotateCcw, Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import { SearchFilters, FilterOptions } from '@/hooks/useAdvancedSearch';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  filterOptions: FilterOptions;
  resultsCount: number;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  filterOptions,
  resultsCount
}) => {
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'sortBy' && key !== 'sortOrder' && value !== ''
  ).length;

  const handleInputChange = (key: keyof SearchFilters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({ [key]: e.target.value });
  };

  const handleSelectChange = (key: keyof SearchFilters) => (value: string) => {
    onFiltersChange({ [key]: value === 'all' ? '' : value });
  };

  const applyAndClose = () => {
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Search Filters
              {activeFiltersCount > 0 && (
                <Badge className="bg-blue-100 text-blue-800">
                  {activeFiltersCount} active
                </Badge>
              )}
            </DrawerTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {resultsCount} results
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-600"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Search Query */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Search className="w-4 h-4" />
              Search Terms
            </Label>
            <Input
              placeholder="Search coins, countries, descriptions..."
              value={filters.query}
              onChange={handleInputChange('query')}
              className="h-12 text-base"
            />
          </div>

          {/* Location & Category */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4" />
                Country
              </Label>
              <Select 
                value={filters.country || 'all'} 
                onValueChange={handleSelectChange('country')}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Any country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any country</SelectItem>
                  {filterOptions.countries?.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Category</Label>
              <Select 
                value={filters.category || 'all'} 
                onValueChange={handleSelectChange('category')}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any category</SelectItem>
                  {filterOptions.categories?.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4" />
              Year Range
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="From year"
                type="number"
                value={filters.yearFrom}
                onChange={handleInputChange('yearFrom')}
                className="h-12 text-base"
              />
              <Input
                placeholder="To year"
                type="number"
                value={filters.yearTo}
                onChange={handleInputChange('yearTo')}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <DollarSign className="w-4 h-4" />
              Price Range (USD)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min price"
                type="number"
                step="0.01"
                value={filters.priceFrom}
                onChange={handleInputChange('priceFrom')}
                className="h-12 text-base"
              />
              <Input
                placeholder="Max price"
                type="number"
                step="0.01"
                value={filters.priceTo}
                onChange={handleInputChange('priceTo')}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Grade & Rarity */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-base">Grade</Label>
              <Select 
                value={filters.grade || 'all'} 
                onValueChange={handleSelectChange('grade')}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Any grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any grade</SelectItem>
                  {filterOptions.grades?.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Rarity</Label>
              <Select 
                value={filters.rarity || 'all'} 
                onValueChange={handleSelectChange('rarity')}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Any rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any rarity</SelectItem>
                  {filterOptions.rarities?.map(rarity => (
                    <SelectItem key={rarity} value={rarity}>
                      {rarity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base">Sort By</Label>
              <Select 
                value={filters.sortBy} 
                onValueChange={handleSelectChange('sortBy')}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Order</Label>
              <Select 
                value={filters.sortOrder} 
                onValueChange={handleSelectChange('sortOrder')}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={applyAndClose}
            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters ({resultsCount} results)
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilterDrawer;