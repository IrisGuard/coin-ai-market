
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import FeaturedCoinsGrid from "@/components/marketplace/FeaturedCoinsGrid";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import AICapabilitiesShowcase from "@/components/showcase/AICapabilitiesShowcase";
import InteractiveAIDemo from "@/components/showcase/InteractiveAIDemo";
import QuickActionsSection from "@/components/QuickActionsSection";
import ServicesSection from "@/components/ServicesSection";
import FeatureSection from "@/components/FeatureSection";
import TrustIndicators from "@/components/showcase/TrustIndicators";
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

      {/* Secondary content moved to bottom */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <QuickActionsSection />
          <ServicesSection />
          <FeatureSection />
        </div>
      </div>

      <AICapabilitiesShowcase />
      <InteractiveAIDemo />
      <TrustIndicators />
      <Footer />
    </div>
  );
};

export default Index;
