
import { useCachedMarketplaceData } from './useCachedMarketplaceData';
import { useCategoryFilters } from './categories/useCategoryFilters';
import { useCategoryLogic } from './categories/useCategoryLogic';
import { useCategoryStats } from './categories/useCategoryStats';
import { useCategoryFiltering } from './categories/useCategoryFiltering';

export { CategoryFilters } from './categories/useCategoryFilters';
export { CategoryStats } from './categories/useCategoryStats';

export const useCategoryData = (category: string) => {
  const { coins: allCoins, isLoading } = useCachedMarketplaceData();
  
  const {
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode
  } = useCategoryFilters();

  const { categoryCoins } = useCategoryLogic(allCoins, category);
  const { filteredCoins } = useCategoryFiltering(categoryCoins, filters);
  const categoryStats = useCategoryStats(categoryCoins);

  return {
    coins: filteredCoins,
    categoryStats,
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode,
    isLoading
  };
};
