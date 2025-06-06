
import { useState } from "react";
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { useCoins } from '@/hooks/useCoins';
import { useAdvancedMarketplaceFilters } from '@/hooks/useAdvancedMarketplaceFilters';
import { useRealTimeMarketplace } from '@/hooks/useRealTimeMarketplace';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnhancedMarketplaceHeader from "@/components/marketplace/EnhancedMarketplaceHeader";
import ThemeAwareMarketplaceFilters from "@/components/marketplace/ThemeAwareMarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";

const Marketplace = () => {
  usePageView();
  
  const { data: coins = [], isLoading: coinsLoading } = useCoins();
  const { stats, loading: statsLoading } = useMarketplaceStats();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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

  // Calculate enhanced stats
  const enhancedStats = {
    total: coins.length,
    auctions: coins.filter(c => c.is_auction).length,
    featured: coins.filter(c => c.featured).length,
    totalValue: coins.reduce((sum, coin) => sum + (coin.price || 0), 0)
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <EnhancedMarketplaceHeader 
            searchTerm={filters.searchTerm}
            setSearchTerm={(term) => updateFilter('searchTerm', term)}
            stats={enhancedStats}
          />
          
          <ThemeAwareMarketplaceFilters
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            filterOptions={filterOptions}
            totalResults={totalResults}
            hasActiveFilters={hasActiveFilters}
            isLoading={coinsLoading}
            auctionsCount={enhancedStats.auctions}
            featuredCount={enhancedStats.featured}
            viewMode={viewMode}
            setViewMode={setViewMode}
            stats={enhancedStats}
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
    </ThemeProvider>
  );
};

export default Marketplace;
