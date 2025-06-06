
import { useState } from "react";
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { useCoins } from '@/hooks/useCoins';
import { useAdvancedMarketplaceFilters } from '@/hooks/useAdvancedMarketplaceFilters';
import { useRealTimeMarketplace } from '@/hooks/useRealTimeMarketplace';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import EnhancedMarketplaceFilters from "@/components/marketplace/EnhancedMarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import MarketplaceStats from "@/components/marketplace/MarketplaceStats";

const Marketplace = () => {
  usePageView();
  
  const { data: coins = [], isLoading: coinsLoading } = useCoins();
  const { stats, loading: statsLoading } = useMarketplaceStats();
  
  // Use enhanced filtering system
  const {
    filters,
    filteredCoins,
    updateFilter,
    clearFilters,
    getFilterOptions,
    totalResults,
    hasActiveFilters
  } = useAdvancedMarketplaceFilters(coins);

  // Real-time updates
  const realTimeUpdates = useRealTimeMarketplace(coins);

  // Apply real-time updates to filtered coins
  const enhancedCoins = filteredCoins.map(coin => {
    const update = realTimeUpdates[coin.id];
    return update ? { ...coin, ...update } : coin;
  });

  const filterOptions = getFilterOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <MarketplaceHeader 
          searchTerm={filters.searchTerm}
          setSearchTerm={(term) => updateFilter('searchTerm', term)}
        />
        
        <MarketplaceStats 
          stats={stats}
          loading={statsLoading}
        />
        
        <EnhancedMarketplaceFilters
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          filterOptions={filterOptions}
          totalResults={totalResults}
          hasActiveFilters={hasActiveFilters}
          isLoading={coinsLoading}
        />
        
        <MarketplaceGrid
          filteredCoins={enhancedCoins}
          searchTerm={filters.searchTerm}
          isAuctionOnly={filters.showAuctionsOnly}
          selectedRarity={filters.selectedRarity}
          clearFilters={clearFilters}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
