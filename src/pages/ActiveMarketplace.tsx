
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useMarketplaceFiltering } from '@/hooks/useMarketplaceFiltering';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceSearch from "@/components/marketplace/MarketplaceSearch";
import ActiveMarketplaceFilters from "@/components/marketplace/ActiveMarketplaceFilters";
import ActiveMarketplaceStats from "@/components/marketplace/ActiveMarketplaceStats";
import ActiveMarketplaceResults from "@/components/marketplace/ActiveMarketplaceResults";

const ActiveMarketplace = () => {
  usePageView();
  usePerformanceMonitoring('ActiveMarketplace');
  
  const { coins, isLoading } = useCachedMarketplaceData();
  const {
    searchTerm,
    setSearchTerm,
    selectedCondition,
    setSelectedCondition,
    selectedRarity,
    setSelectedRarity,
    sortBy,
    setSortBy,
    showAuctionsOnly,
    setShowAuctionsOnly,
    showFeaturedOnly,
    setShowFeaturedOnly,
    viewMode,
    setViewMode,
    filteredCoins,
    clearFilters
  } = useMarketplaceFiltering(coins);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-4">
            Marketplace
          </h1>
          <p className="text-electric-green">
            Discover authentic coins from collectors worldwide
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <MarketplaceSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Filters */}
        <ActiveMarketplaceFilters
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          selectedRarity={selectedRarity}
          setSelectedRarity={setSelectedRarity}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAuctionsOnly={showAuctionsOnly}
          setShowAuctionsOnly={setShowAuctionsOnly}
          showFeaturedOnly={showFeaturedOnly}
          setShowFeaturedOnly={setShowFeaturedOnly}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          clearFilters={clearFilters}
        />

        {/* Results Stats */}
        <ActiveMarketplaceStats
          filteredCount={filteredCoins.length}
          totalCount={coins.length}
        />

        {/* Results */}
        <ActiveMarketplaceResults
          isLoading={isLoading}
          filteredCoins={filteredCoins}
          viewMode={viewMode}
          clearFilters={clearFilters}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ActiveMarketplace;
