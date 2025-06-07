
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import Footer from "@/components/Footer";
import OptimizedCoinCard from "@/components/OptimizedCoinCard";
import { Loader2 } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  
  const { coins, isLoading } = useCachedMarketplaceData();

  // Always calculate featuredCoins - never conditional
  const featuredCoins = React.useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => coin.authentication_status === 'verified')
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
        {/* Categories Grid */}
        <CategoriesGrid />
        
        {/* Trending Section */}
        <TrendingCoins />
        
        {/* Featured Coins Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-6 text-center">
            Featured Coins
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
                <span className="text-electric-blue">Loading coins...</span>
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
      </div>

      <Footer />
    </div>
  );
};

export default Index;
