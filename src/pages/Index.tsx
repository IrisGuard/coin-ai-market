
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

const Index = () => {
  usePageView();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
