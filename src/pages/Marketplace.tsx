
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { useMarketplaceState } from '@/hooks/useMarketplaceState';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnhancedMarketplaceHeader from "@/components/marketplace/EnhancedMarketplaceHeader";
import ThemeAwareMarketplaceFilters from "@/components/marketplace/ThemeAwareMarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";

const Marketplace = () => {
  usePageView();
  
  const { stats, loading: statsLoading } = useMarketplaceStats();
  const {
    enhancedCoins,
    coinsLoading,
    coinsError,
    viewMode,
    setViewMode,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    totalResults,
    hasActiveFilters,
    enhancedStats
  } = useMarketplaceState();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-secondary dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-colors duration-300">
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
            isLoading={coinsLoading}
            error={coinsError}
          />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Marketplace;
