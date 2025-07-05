import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchEnhancement } from '@/hooks/useSearchEnhancement';
import Navbar from "@/components/Navbar";
import CategoryNavigationFix from "@/components/marketplace/CategoryNavigationFix";
import FeaturedCoinsGrid from "@/components/marketplace/FeaturedCoinsGrid";
import AdvancedSearchInterface from "@/components/search/AdvancedSearchInterface";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import PhaseCompletionButton from "@/components/ui/PhaseCompletionButton";

const Index = () => {
  // Always use hooks - no conditional calls
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const { isAuthenticated } = useAuth();
  const { performSearch } = useSearchEnhancement();

  const handleSearch = (query: string) => {
    try {
      performSearch(query);
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    } catch (error) {
      console.error('Search error:', error);
      // Fallback navigation
      window.location.href = '/marketplace';
    }
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        {/* Clean Hero Section */}
        <div className="bg-white border-b border-gray-200 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find the perfect coin for you
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover authentic coins from <Link to="/marketplace" className="text-blue-600 hover:underline">verified dealers</Link> worldwide with advanced AI recognition
              </p>
              
              {/* Advanced Search Interface */}
              <div className="max-w-4xl mx-auto mb-8">
                <Suspense fallback={<div className="h-16 bg-gray-200 rounded-xl animate-pulse" />}>
                  <AdvancedSearchInterface
                    placeholder="Search coins with AI-powered suggestions..."
                    onSearch={handleSearch}
                    showVoiceSearch={true}
                    showImageSearch={true}
                    showAISearch={true}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="h-12 bg-gray-200 rounded animate-pulse" />}>
            <CategoryNavigationFix />
          </Suspense>
          <div className="mt-8">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            }>
              <FeaturedCoinsGrid />
            </Suspense>
          </div>
        </div>

        <Footer />
        <VoiceInterface />
        
        {/* Phase 2 Completion Button */}
        <PhaseCompletionButton
          phase={2}
          nextPhase={3}
          completionPercentage={100}
          isVisible={true}
          onProceed={() => {
            console.log('Phase 2 Complete - Proceeding to Phase 3');
            alert('🎉 Phase 2 Complete!\n\n✅ Advanced Search Integration\n✅ Performance Optimizations\n✅ Mobile Experience Enhancements\n✅ Real-time Data Integration\n\nReady for Phase 3!');
          }}
        />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Index; 