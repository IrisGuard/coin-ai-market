
import { useState, useMemo } from 'react';

export interface CategoryFilters {
  searchTerm: string;
  sortBy: string;
  priceRange: [number, number];
  yearRange: [number, number];
  selectedCountry: string | null;
  selectedCondition: string | null;
  selectedRarity: string | null;
  showAuctionsOnly: boolean;
  showFeaturedOnly: boolean;
}

export const useCategoryFilters = () => {
  const [filters, setFilters] = useState<CategoryFilters>({
    searchTerm: '',
    sortBy: 'newest',
    priceRange: [0, 10000],
    yearRange: [0, 2024],
    selectedCountry: null,
    selectedCondition: null,
    selectedRarity: null,
    showAuctionsOnly: false,
    showFeaturedOnly: false
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const updateFilter = (key: keyof CategoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      sortBy: 'newest',
      priceRange: [0, 10000],
      yearRange: [0, 2024],
      selectedCountry: null,
      selectedCondition: null,
      selectedRarity: null,
      showAuctionsOnly: false,
      showFeaturedOnly: false
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedCountry) count++;
    if (filters.selectedCondition) count++;
    if (filters.selectedRarity) count++;
    if (filters.showAuctionsOnly) count++;
    if (filters.showFeaturedOnly) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    if (filters.yearRange[0] > 0 || filters.yearRange[1] < 2024) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode
  };
};
