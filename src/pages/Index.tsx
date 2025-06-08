
import React from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchEnhancement } from '@/hooks/useSearchEnhancement';
import Navbar from "@/components/Navbar";
import CategoryNavigationFix from "@/components/marketplace/CategoryNavigationFix";
import EnhancedSearchBar from "@/components/search/EnhancedSearchBar";
import FeaturedCoinsSection from "@/components/marketplace/FeaturedCoinsSection";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";
import EnhancedNavigationButtons from "@/components/navigation/EnhancedNavigationButtons";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const { isAuthenticated } = useAuth();
  const { performSearch } = useSearchEnhancement();

  const handleSearch = (query: string) => {
    performSearch(query);
    // Navigate to marketplace with search query
    window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Enhanced Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find the perfect coin for you
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover authentic coins from <Link to="/marketplace" className="text-electric-blue hover:underline">verified dealers</Link> worldwide with advanced AI recognition
              </p>
              
              {/* Enhanced Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <EnhancedSearchBar
                      placeholder="Search coins with AI suggestions..."
                      onSearch={handleSearch}
                    />
                  </div>
                  <Link to="/marketplace">
                    <Button 
                      size="sm"
                      className="bg-electric-orange hover:bg-electric-orange/90 text-white px-3 py-1 text-xs h-12"
                    >
                      Browse Categories
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Categories Grid */}
          <CategoryNavigationFix />
        </div>

        {/* Featured Coins Section with 1000+ coins */}
        <FeaturedCoinsSection />

        <Footer />

        {/* Enhanced Navigation Buttons */}
        <EnhancedNavigationButtons />

        {/* Voice Interface */}
        <VoiceInterface />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Index;
