
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Simple Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find the perfect coin for you
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover authentic coins from verified dealers worldwide
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for coins..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <Button className="bg-electric-orange hover:bg-electric-orange/90 text-white px-8 py-3">
                  Browse Categories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <CategoriesGrid />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
