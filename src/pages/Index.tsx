'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchEnhancement } from '@/hooks/useSearchEnhancement';
import Navbar from "@/components/Navbar";
import CategoryNavigationFix from "@/components/marketplace/CategoryNavigationFix";
import FeaturedCoinsGrid from "@/components/marketplace/FeaturedCoinsGrid";
import EnhancedSearchBar from "@/components/search/EnhancedSearchBar";
import AdvancedSearchInterface from "@/components/search/AdvancedSearchInterface";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import PhaseCompletionButton from "@/components/ui/PhaseCompletionButton";
import { motion } from 'framer-motion';

const Index = () => {
  const [isClient, setIsClient] = useState(false);
  
  // Client-side only hooks
  const pageViewHook = isClient ? usePageView() : null;
  const perfMonHook = isClient ? usePerformanceMonitoring('IndexPage') : null;
  const { isAuthenticated } = isClient ? useAuth() : { isAuthenticated: false };
  const { performSearch } = isClient ? useSearchEnhancement() : { performSearch: () => {} };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = (query: string) => {
    if (isClient && performSearch) {
      performSearch(query);
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Clean Hero Section */}
        <div className="bg-white border-b border-gray-200 relative">
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
              
              {/* Advanced Search Interface */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto mb-8"
              >
                <AdvancedSearchInterface
                  placeholder="Search coins with AI-powered suggestions..."
                  onSearch={handleSearch}
                  showVoiceSearch={true}
                  showImageSearch={true}
                  showAISearch={true}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryNavigationFix />
          <div className="mt-8">
            <FeaturedCoinsGrid />
          </div>
        </div>

        <Footer />
        <VoiceInterface />
        
        {/* Phase 2 Completion Button */}
        <PhaseCompletionButton
          phase={2}
          nextPhase={3}
          completionPercentage={100}
          isVisible={isClient}
          onProceed={() => {
            console.log('Phase 2 Complete - Proceeding to Phase 3');
            // This would trigger Phase 3 implementation
            alert('🎉 Phase 2 Complete!\n\n✅ Advanced Search Integration\n✅ Performance Optimizations\n✅ Mobile Experience Enhancements\n✅ Real-time Data Integration\n\nReady for Phase 3!');
          }}
        />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Index; 