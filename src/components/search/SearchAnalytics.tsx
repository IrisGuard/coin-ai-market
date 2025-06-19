
import React, { useMemo } from 'react';
import { generateSearchAnalytics } from '@/utils/searchAnalyticsUtils';
import SearchPerformanceCard from './analytics/SearchPerformanceCard';
import PriceAnalysisCard from './analytics/PriceAnalysisCard';
import CategoryDistributionCard from './analytics/CategoryDistributionCard';
import RarityDistributionCard from './analytics/RarityDistributionCard';
import SearchInsightsCard from './analytics/SearchInsightsCard';

interface SearchAnalyticsProps {
  searchQuery: string;
  searchResults: any[];
  searchTime: number;
}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({
  searchQuery,
  searchResults,
  searchTime
}) => {
  const analytics = useMemo(() => {
    return generateSearchAnalytics(searchResults);
  }, [searchResults]);

  return (
    <div className="space-y-6">
      <SearchPerformanceCard
        totalResults={analytics.totalResults}
        searchTime={analytics.searchTime}
        relevanceScore={analytics.relevanceScore}
        popularityIndex={analytics.popularityIndex}
      />

      <PriceAnalysisCard priceRange={analytics.priceRange} />

      <CategoryDistributionCard 
        categories={analytics.categories}
        totalResults={analytics.totalResults}
      />

      <RarityDistributionCard 
        rarityDistribution={analytics.rarityDistribution}
        totalResults={analytics.totalResults}
      />

      <SearchInsightsCard
        totalResults={analytics.totalResults}
        relevanceScore={analytics.relevanceScore}
        priceMin={analytics.priceRange.min}
        priceMax={analytics.priceRange.max}
        popularityIndex={analytics.popularityIndex}
        searchTime={analytics.searchTime}
      />
    </div>
  );
};

export default SearchAnalytics;
