
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import Footer from "@/components/Footer";
import OptimizedCoinCard from "@/components/OptimizedCoinCard";
import { Loader2 } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  
  const { coins, isLoading } = useCachedMarketplaceData();

  // Filter to show only direct sales (not auctions) on the homepage
  const directSaleCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => 
        coin.authentication_status === 'verified' && 
        coin.listing_type !== 'auction' && 
        !coin.is_auction
      )
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.views || 0) - (a.views || 0);
      })
      .slice(0, 12);
  }, [coins]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with colorful categories */}
      <MarketplaceHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Section */}
        <TrendingCoins />
        
        {/* Direct Sale Coins Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Featured Coins - Buy Now
            </h2>
            <a 
              href="/auctions" 
              className="text-electric-orange hover:text-electric-red transition-colors font-medium"
            >
              View Auctions →
            </a>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
                <span className="text-electric-blue">Loading coins...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {directSaleCoins.map((coin, index) => (
                <div key={coin.id} className="w-full">
                  <OptimizedCoinCard coin={coin} index={index} priority={index < 6} />
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && directSaleCoins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No direct sale coins available at the moment.</p>
              <p className="text-gray-400 mt-2">Check our auctions page for more items!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
