
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import FeaturedCoinsSection from "@/components/marketplace/FeaturedCoinsSection";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/admin/AdminPanel";
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Discover the World's
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Rarest Coins
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered identification, secure marketplace, and expert authentication. 
              Join thousands of collectors in the digital numismatic revolution.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for ancient coins, modern currencies, or rare collectibles..."
                    className="w-full px-8 py-6 text-lg lg:text-xl border-2 border-gray-200 rounded-2xl bg-white shadow-xl focus:ring-4 focus:ring-yellow-400/30 focus:border-yellow-400 focus:outline-none placeholder-gray-500 transition-all duration-300 hover:shadow-2xl"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 lg:h-7 lg:w-7 text-gray-400" />
                </div>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-6 text-lg lg:text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 sm:min-w-[180px]">
                  Explore Now
                </Button>
              </div>
            </div>

            {/* Stats - Full Width Responsive */}
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 xl:gap-12">
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">1,245+</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Active Listings</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">126</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Live Auctions</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">45K+</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Collectors</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">$1.2M+</div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">Trading Volume</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Grid */}
        <CategoriesGrid />
        
        {/* Featured Coins Section */}
        <FeaturedCoinsSection />
      </div>

      <Footer />

      {/* Fixed Admin Buttons - Bottom Right */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        <button 
          onClick={() => setShowAdminPanel(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          Admin Panel
        </button>
        <Link 
          to="/marketplace/panel" 
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-decoration-none"
        >
          User Panel
        </Link>
      </div>

      {/* Admin Panel Dialog */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
};

export default Index;
