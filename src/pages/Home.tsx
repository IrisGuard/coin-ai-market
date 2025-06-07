
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ServicesSection from "@/components/ServicesSection";
import QuickActionsSection from "@/components/QuickActionsSection";
import Footer from "@/components/Footer";

const Home = () => {
  usePageView();
  usePerformanceMonitoring('HomePage');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <ServicesSection />
      <QuickActionsSection />
      <Footer />
    </div>
  );
};

export default Home;
