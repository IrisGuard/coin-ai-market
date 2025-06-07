
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
import { Search, Star, Shield, Zap, TrendingUp, Award } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Discover the World's
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Rarest Coins
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              AI-powered identification, secure marketplace, and expert authentication. 
              Join thousands of collectors in the digital numismatic revolution.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for ancient coins, modern currencies, or rare collectibles..."
                    className="w-full px-6 py-4 text-lg border-0 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl focus:ring-4 focus:ring-yellow-400/50 focus:outline-none placeholder-gray-500"
                  />
                  <Search className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
                </div>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-2xl shadow-2xl">
                  Explore Now
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">1,245+</div>
                <div className="text-blue-200">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">126</div>
                <div className="text-blue-200">Live Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">45K+</div>
                <div className="text-blue-200">Collectors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">$1.2M+</div>
                <div className="text-blue-200">Trading Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CoinVision?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets traditional numismatics for the ultimate collecting experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Recognition</h3>
              <p className="text-gray-600">Instant coin identification with 99% accuracy using advanced computer vision</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Trading</h3>
              <p className="text-gray-600">Bank-level security with buyer protection and verified sellers</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Authentication</h3>
              <p className="text-gray-600">Professional numismatists verify high-value coins for authenticity</p>
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
