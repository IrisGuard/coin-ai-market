
import React from 'react';
import { motion } from 'framer-motion';
import CategoryHeader from '@/components/categories/CategoryHeader';
import CategoryStats from '@/components/categories/CategoryStats';
import CategoryFilters from '@/components/categories/CategoryFilters';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import CategoryLoadingState from '@/components/categories/CategoryLoadingState';
import CategoryEmptyState from '@/components/categories/CategoryEmptyState';
import { Coin } from '@/types/coin';
import { CategoryFilters as CategoryFiltersType, CategoryStats as CategoryStatsType } from '@/hooks/useCategoryData';

interface CategoryContentProps {
  category: string;
  categoryTitle: string;
  categoryDescription: string;
  coins: Coin[];
  categoryStats: CategoryStatsType;
  filters: CategoryFiltersType;
  updateFilter: (key: keyof CategoryFiltersType, value: any) => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  isLoading: boolean;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  category,
  categoryTitle,
  categoryDescription,
  coins,
  categoryStats,
  filters,
  updateFilter,
  clearAllFilters,
  activeFiltersCount,
  viewMode,
  setViewMode,
  isLoading
}) => {
  return (
    <>
      <CategoryHeader
        category={category}
        title={categoryTitle}
        description={categoryDescription}
        coinCount={categoryStats.totalCoins}
        isLoading={isLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryStats
          category={category}
          totalCoins={categoryStats.totalCoins}
          averagePrice={categoryStats.averagePrice}
          priceRange={categoryStats.priceRange}
          mostExpensive={categoryStats.mostExpensive}
          oldestCoin={categoryStats.oldestCoin}
          newestCoin={categoryStats.newestCoin}
          totalAuctions={categoryStats.totalAuctions}
          featuredCount={categoryStats.featuredCount}
        />

        <CategoryFilters
          category={category}
          searchTerm={filters.searchTerm}
          setSearchTerm={(value) => updateFilter('searchTerm', value)}
          sortBy={filters.sortBy}
          setSortBy={(value) => updateFilter('sortBy', value)}
          priceRange={filters.priceRange}
          setPriceRange={(value) => updateFilter('priceRange', value)}
          yearRange={filters.yearRange}
          setYearRange={(value) => updateFilter('yearRange', value)}
          selectedCountry={filters.selectedCountry || ''}
          setSelectedCountry={(value) => updateFilter('selectedCountry', value)}
          selectedCondition={filters.selectedCondition || ''}
          setSelectedCondition={(value) => updateFilter('selectedCondition', value)}
          selectedRarity={filters.selectedRarity || ''}
          setSelectedRarity={(value) => updateFilter('selectedRarity', value)}
          showAuctionsOnly={filters.showAuctionsOnly}
          setShowAuctionsOnly={(value) => updateFilter('showAuctionsOnly', value)}
          showFeaturedOnly={filters.showFeaturedOnly}
          setShowFeaturedOnly={(value) => updateFilter('showFeaturedOnly', value)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          clearAllFilters={clearAllFilters}
          activeFiltersCount={activeFiltersCount}
        />

        {isLoading ? (
          <CategoryLoadingState categoryTitle={categoryTitle} />
        ) : (
          <>
            {coins.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                  : "space-y-4"
                }
              >
                {coins.map((coin, index) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full"
                  >
                    <OptimizedCoinCard 
                      coin={coin} 
                      index={index} 
                      priority={index < 12}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <CategoryEmptyState 
                activeFiltersCount={activeFiltersCount}
                clearAllFilters={clearAllFilters}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CategoryContent;
