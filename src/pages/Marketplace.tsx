
import { useState } from "react";
import { usePageView } from '@/hooks/usePageView';
import { useMarketplaceStats } from '@/hooks/useMarketplaceStats';
import { useRealMarketplaceData } from '@/hooks/useRealMarketplaceData';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import MarketplaceStats from "@/components/marketplace/MarketplaceStats";

const Marketplace = () => {
  usePageView();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Get marketplace stats
  const { stats, loading: statsLoading } = useMarketplaceStats();
  
  // Get filtered marketplace data
  const { 
    filteredCoins, 
    loading: coinsLoading,
    auctionsCount,
    featuredCount
  } = useRealMarketplaceData({
    searchTerm,
    selectedRarity,
    selectedCondition,
    priceRange,
    sortBy,
    showAuctionsOnly,
    showFeaturedOnly
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRarity("");
    setSelectedCondition("");
    setPriceRange([0, 10000]);
    setShowAuctionsOnly(false);
    setShowFeaturedOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <MarketplaceHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <MarketplaceStats 
          stats={stats}
          loading={statsLoading}
        />
        <MarketplaceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRarity={selectedRarity}
          setSelectedRarity={setSelectedRarity}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAuctionsOnly={showAuctionsOnly}
          setShowAuctionsOnly={setShowAuctionsOnly}
          showFeaturedOnly={showFeaturedOnly}
          setShowFeaturedOnly={setShowFeaturedOnly}
          clearFilters={clearFilters}
          filteredCount={filteredCoins.length}
          isLoading={coinsLoading}
          auctionsCount={auctionsCount}
          featuredCount={featuredCount}
        />
        <MarketplaceGrid
          filteredCoins={filteredCoins}
          searchTerm={searchTerm}
          isAuctionOnly={showAuctionsOnly}
          selectedRarity={selectedRarity}
          clearFilters={clearFilters}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
