
import React from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import CategoriesGrid from "@/components/marketplace/CategoriesGrid";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
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
      
      {/* Enhanced Hero Section */}
      <HeroSection />
      
      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoriesGrid />
      </div>

      {/* Features Section */}
      <FeatureSection />

      <Footer />

      {/* Enhanced Fixed Buttons - Bottom Right */}
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
