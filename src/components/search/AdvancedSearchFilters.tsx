
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  RotateCcw,
  Search,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';

interface SearchFilters {
  query: string;
  country: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  grade: string;
  rarity: string;
  category: string;
  sortBy: 'price' | 'year' | 'name' | 'rarity';
  sortOrder: 'asc' | 'desc';
}

interface FilterOptions {
  countries: string[];
  grades: string[];
  rarities: string[];
  categories: string[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
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
    onFiltersChange({ [key]: value });
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Advanced Search Filters
            {activeFiltersCount > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
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
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search-query" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Terms
          </Label>
          <Input
            id="search-query"
            placeholder="Search coins, countries, descriptions..."
            value={filters.query}
            onChange={handleInputChange('query')}
          />
        </div>

        {/* Location & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Country
            </Label>
            <Select 
              value={filters.country} 
              onValueChange={handleSelectChange('country')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any country</SelectItem>
                {filterOptions.countries?.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={filters.category} 
              onValueChange={handleSelectChange('category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any category</SelectItem>
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
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Year Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="From year"
              type="number"
              value={filters.yearFrom}
              onChange={handleInputChange('yearFrom')}
              min={filterOptions.yearRange?.min}
              max={filterOptions.yearRange?.max}
            />
            <Input
              placeholder="To year"
              type="number"
              value={filters.yearTo}
              onChange={handleInputChange('yearTo')}
              min={filterOptions.yearRange?.min}
              max={filterOptions.yearRange?.max}
            />
          </div>
          <div className="text-xs text-gray-500">
            Available range: {filterOptions.yearRange?.min} - {filterOptions.yearRange?.max}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
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
            />
            <Input
              placeholder="Max price"
              type="number"
              step="0.01"
              value={filters.priceTo}
              onChange={handleInputChange('priceTo')}
            />
          </div>
        </div>

        {/* Grade & Rarity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select 
              value={filters.grade} 
              onValueChange={handleSelectChange('grade')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any grade</SelectItem>
                {filterOptions.grades?.map(grade => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rarity</Label>
            <Select 
              value={filters.rarity} 
              onValueChange={handleSelectChange('rarity')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any rarity</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={handleSelectChange('sortBy')}
            >
              <SelectTrigger>
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
            <Label>Order</Label>
            <Select 
              value={filters.sortOrder} 
              onValueChange={handleSelectChange('sortOrder')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchFilters;
