
import { usePageView } from '@/hooks/usePageView';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import Footer from "@/components/Footer";
import OptimizedCoinCard from "@/components/OptimizedCoinCard";
import { Loader2 } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  
  const { coins, isLoading } = useCachedMarketplaceData();

  // Get featured coins for homepage
  const featuredCoins = coins
    .filter(coin => coin.authentication_status === 'verified')
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.views || 0) - (a.views || 0);
    })
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Etsy style with search */}
      <MarketplaceHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Section */}
        <CategoriesGrid />
        
        {/* Trending Section */}
        <TrendingCoins />
        
        {/* Featured Coins Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Coins
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                <span className="text-gray-600">Loading coins...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {featuredCoins.map((coin, index) => (
                <div key={coin.id} className="w-full">
                  <OptimizedCoinCard coin={coin} index={index} priority={index < 6} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* View All Link */}
        <div className="text-center mb-12">
          <a 
            href="/marketplace" 
            className="inline-block px-8 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            View all coins in marketplace
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
