
import { usePageView } from '@/hooks/usePageView';
import { useCoins } from '@/hooks/useCoins';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import FeaturedCoinsGrid from "@/components/marketplace/FeaturedCoinsGrid";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import Footer from "@/components/Footer";
import { Loader2 } from 'lucide-react';

const Index = () => {
  usePageView();
  const { isLoading } = useCoins();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      
      {/* Etsy-style marketplace layout */}
      <MarketplaceHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <CategoriesGrid />
        
        {/* Trending Section */}
        <TrendingCoins />
        
        {/* Main Coins Grid - No title, just the grid like Etsy */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                <span className="text-text-secondary">Loading marketplace...</span>
              </div>
            </div>
          ) : (
            <FeaturedCoinsGrid />
          )}
        </div>
        
        {/* View All Link */}
        <div className="text-center mb-12">
          <a 
            href="/marketplace" 
            className="inline-block px-6 py-3 bg-brand-primary text-bg-primary font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            View all coins
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
