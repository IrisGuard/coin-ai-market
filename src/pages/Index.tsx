
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import FeaturedCoinsGrid from "@/components/marketplace/FeaturedCoinsGrid";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import Footer from "@/components/Footer";

const Index = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-white">
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
          <FeaturedCoinsGrid />
        </div>
        
        {/* View All Link */}
        <div className="text-center mb-12">
          <a 
            href="/marketplace" 
            className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
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
