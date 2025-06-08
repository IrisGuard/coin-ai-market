
import React from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Search, Settings, Users } from 'lucide-react';

const Index = () => {
  usePageView();
  usePerformanceMonitoring('IndexPage');
  const { isAuthenticated } = useAuth();

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
              Discover authentic coins from <Link to="/marketplace" className="text-electric-blue hover:underline">verified dealers</Link> worldwide
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
                <Link to="/marketplace">
                  <Button className="bg-electric-orange hover:bg-electric-orange/90 text-white px-8 py-3">
                    Browse Categories
                  </Button>
                </Link>
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

      {/* Fixed Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <Link to="/admin">
          <Button 
            className="bg-electric-blue hover:bg-electric-blue/90 text-white px-4 py-2 text-sm shadow-lg"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        </Link>
        <Link to="/marketplace/panel">
          <Button 
            className="bg-electric-green hover:bg-electric-green/90 text-white px-4 py-2 text-sm shadow-lg"
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            User Panel
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
