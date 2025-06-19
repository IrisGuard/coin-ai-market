
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { SearchFilters as SearchFiltersType } from '@/types/searchTypes';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClearFilters: () => void;
  resultCount: number;
  isLoading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  isLoading = false
}) => {
  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value !== '';
    return false;
  });

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'query' || key === 'sortBy') return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value !== '';
    return false;
  }).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryFilter
          selectedCategory={filters.category}
          onCategoryChange={(category) => onFiltersChange({ category })}
        />

        <PriceRangeFilter
          priceFrom={filters.priceFrom}
          priceTo={filters.priceTo}
          onPriceChange={(priceFrom, priceTo) => onFiltersChange({ priceFrom, priceTo })}
        />

        <div className="text-sm text-gray-600">
          {isLoading ? 'Searching...' : `${resultCount} results found`}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
