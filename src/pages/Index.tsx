
import React, { useState } from 'react';
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
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import BuyerSignupForm from "@/components/auth/BuyerSignupForm";
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const { isAuthenticated } = useAuth();
  const { performSearch } = useSearchEnhancement();
  const [showBuyerSignup, setShowBuyerSignup] = useState(false);

  const handleSearch = (query: string) => {
    performSearch(query);
    window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* 🚨 NO AdminKeyboardHandler here - it's ONLY in App.tsx */}
        
        {/* Enhanced Hero Section */}
        <div className="bg-white border-b border-gray-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Top-right Join as Buyer Button - Only show if not authenticated */}
            {!isAuthenticated && (
              <div className="absolute top-4 right-4">
                <Button
                  onClick={() => setShowBuyerSignup(true)}
                  size="sm"
                  className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-purple hover:to-electric-pink text-white text-sm font-medium flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Join as Buyer
                </Button>
              </div>
            )}

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
              
              {/* Enhanced Search Bar with larger width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto mb-8"
              >
                <EnhancedSearchBar
                  placeholder="Search coins with AI suggestions..."
                  onSearch={handleSearch}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryNavigationFix />
        </div>

        <FeaturedCoinsSection />

        <Footer />
        <VoiceInterface />

        {/* Buyer Signup Modal */}
        <BuyerSignupForm 
          isOpen={showBuyerSignup} 
          onClose={() => setShowBuyerSignup(false)} 
        />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Index;
