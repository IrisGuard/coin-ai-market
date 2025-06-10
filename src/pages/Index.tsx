
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
import AdminKeyboardHandler from "@/components/admin/AdminKeyboardHandler";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ServicesSection from "@/components/ServicesSection";
import QuickActionsSection from "@/components/QuickActionsSection";
import { motion } from 'framer-motion';
import { ShoppingCart, Camera, Coins, TrendingUp } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        
        {/* Admin Keyboard Handler */}
        <AdminKeyboardHandler />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50"></div>
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 blur-xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 blur-xl"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top-right Join as Buyer Button */}
            {!isAuthenticated && (
              <div className="absolute top-4 right-4">
                <Button
                  onClick={() => setShowBuyerSignup(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white text-sm font-medium flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Join as Buyer
                </Button>
              </div>
            )}

            <div className="text-center">
              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Coin Recognition
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Upload photos of your coins and get instant{' '}
                <span className="font-semibold text-blue-600">
                  AI identification
                </span>
                , accurate{' '}
                <span className="font-semibold text-green-600">
                  valuations
                </span>
                , and access to a global{' '}
                <span className="font-semibold text-purple-600">
                  marketplace
                </span>
              </motion.p>

              {/* Enhanced Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto mb-12"
              >
                <EnhancedSearchBar
                  placeholder="Search coins with AI suggestions..."
                  onSearch={handleSearch}
                />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <Link 
                  to="/upload" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  Start Identifying Coins
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </Link>
                
                <Link 
                  to="/marketplace" 
                  className="px-8 py-4 border-2 border-purple-500 text-purple-600 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:shadow-lg flex items-center gap-3"
                >
                  <TrendingUp className="w-6 h-6" />
                  Explore Marketplace
                </Link>
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              >
                {[
                  {
                    icon: <Camera className="w-8 h-8" />,
                    title: 'Instant Recognition',
                    description: '99% accuracy in seconds',
                    color: 'from-orange-400 to-red-500',
                    textColor: 'text-orange-600'
                  },
                  {
                    icon: <TrendingUp className="w-8 h-8" />,
                    title: 'Real-time Pricing',
                    description: 'Live market valuations',
                    color: 'from-green-400 to-emerald-500',
                    textColor: 'text-green-600'
                  },
                  {
                    icon: <Coins className="w-8 h-8" />,
                    title: 'Global Marketplace',
                    description: 'Buy & sell worldwide',
                    color: 'from-blue-400 to-cyan-500',
                    textColor: 'text-blue-600'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${feature.textColor}`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Category Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryNavigationFix />
        </div>

        {/* Featured Coins Section */}
        <FeaturedCoinsSection />

        {/* Additional Sections */}
        <FeatureSection />
        <ServicesSection />
        <QuickActionsSection />

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
