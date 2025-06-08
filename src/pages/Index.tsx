
import React from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchEnhancement } from '@/hooks/useSearchEnhancement';
import Navbar from "@/components/Navbar";
import EnhancedCategoriesGrid from "@/components/marketplace/EnhancedCategoriesGrid";
import EnhancedSearchBar from "@/components/search/EnhancedSearchBar";
import Footer from "@/components/Footer";
import VoiceInterface from "@/components/VoiceInterface";
import { Button } from '@/components/ui/button';
import { Settings, Users } from 'lucide-react';
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
              Discover authentic coins from <Link to="/marketplace" className="text-electric-blue hover:underline">verified dealers</Link> worldwide
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
                    placeholder="Search for coins..."
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
        <EnhancedCategoriesGrid />
      </div>

      <Footer />

      {/* Fixed Buttons - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 flex flex-col gap-3 z-40"
      >
        <Link to="/admin">
          <Button 
            className="bg-electric-blue hover:bg-electric-blue/90 text-white px-4 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        </Link>
        <Link to="/marketplace/panel">
          <Button 
            className="bg-electric-green hover:bg-electric-green/90 text-white px-4 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            User Panel
          </Button>
        </Link>
      </motion.div>

      {/* Voice Interface */}
      <VoiceInterface />
    </div>
  );
};

export default Index;
