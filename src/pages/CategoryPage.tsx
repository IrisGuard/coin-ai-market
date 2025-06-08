
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb';
import BackButton from '@/components/navigation/BackButton';
import CategoryHeader from '@/components/categories/CategoryHeader';
import CategoryStats from '@/components/categories/CategoryStats';
import CategoryFilters from '@/components/categories/CategoryFilters';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { useCategoryData } from '@/hooks/useCategoryData';
import { Loader2, Coins } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // REDIRECT FIX: If accessing auctions category, redirect to auctions page
  useEffect(() => {
    if (category === 'auctions') {
      navigate('/auctions', { replace: true });
      return;
    }
  }, [category, navigate]);

  const {
    coins,
    categoryStats,
    filters,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
    viewMode,
    setViewMode,
    isLoading
  } = useCategoryData(category || '');

  const getCategoryTitle = (cat: string) => {
    const titles: { [key: string]: string } = {
      'ancient': 'Ancient Coins',
      'modern': 'Modern Coins', 
      'error': 'Error Coins',
      'graded': 'Graded Coins',
      'trending': 'Trending Coins',
      'european': 'European Coins',
      'american': 'American Coins',
      'asian': 'Asian Coins',
      'gold': 'Gold Coins',
      'silver': 'Silver Coins',
      'rare': 'Rare Coins'
    };
    return titles[cat] || 'Category';
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions: { [key: string]: string } = {
      'ancient': 'Discover magnificent coins from ancient civilizations, empires and historic periods. Each piece tells a story from bygone eras and ancient craftsmanship.',
      'modern': 'Explore modern coins from the contemporary era (1900 onwards), featuring updated designs, advanced minting techniques and modern themes.',
      'error': 'Find rare error coins and minting mistakes that are highly valued by collectors. These unique pieces represent fascinating production anomalies.',
      'graded': 'Browse professionally graded coins certified by PCGS, NGC and other top grading services with certified quality and condition.',
      'trending': 'Popular coins currently trending with collectors worldwide. Stay ahead of market movements and collector preferences.',
      'european': 'European coins from various countries and time periods, showcasing the rich numismatic heritage of the European continent.',
      'american': 'Coins from the United States, Canada and Mexico, representing the diverse numismatic traditions of North America.',
      'asian': 'Asian coins from China, Japan, India, Korea and other countries, featuring unique designs and cultural significance.',
      'gold': 'Precious metal coins containing gold in various purities. These pieces combine numismatic value with precious metal content.',
      'silver': 'Silver coins and precious metal collectibles with inherent value and numismatic appeal from various mints worldwide.',
      'rare': 'Extremely rare and valuable coins for serious collectors, with low mintages, historical significance or unique characteristics.'
    };
    return descriptions[cat] || 'Browse this specialized category of coins.';
  };

  if (!category || category === 'auctions') {
    return null; // Will redirect
  }

  const categoryTitle = getCategoryTitle(category);
  const categoryDescription = getCategoryDescription(category);

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <NavigationBreadcrumb />
        
        <div className="pt-4">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <BackButton to="/marketplace" label="Back to Marketplace" />
          </div>

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
              <div className="flex justify-center items-center py-16">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
                  <span className="text-electric-blue">Loading {categoryTitle.toLowerCase()}...</span>
                </div>
              </div>
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coins className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No coins found</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        There are no coins matching the current filter criteria in this category.
                      </p>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="text-electric-blue hover:text-electric-purple font-medium text-sm"
                        >
                          Clear all filters to see more results
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default CategoryPage;
