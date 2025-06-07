
import React from 'react';
import Navbar from '@/components/Navbar';
import WelcomeSection from '@/components/WelcomeSection';
import CoinGrid from '@/components/CoinGrid';
import { usePageView } from '@/hooks/usePageView';

const Index = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navbar />
      <WelcomeSection />
      <CoinGrid />
    </div>
  );
};

export default Index;
