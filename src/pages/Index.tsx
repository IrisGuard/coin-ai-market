
import React from 'react';
import Navbar from '@/components/Navbar';
import WelcomeSection from '@/components/WelcomeSection';
import CoinGrid from '@/components/CoinGrid';
import { usePageView } from '@/hooks/usePageView';
import { useCoins } from '@/hooks/useCoins';

const Index = () => {
  usePageView();
  const { data: coins = [], isLoading } = useCoins();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navbar />
      <WelcomeSection />
      <div className="container mx-auto px-4 py-8">
        <CoinGrid coins={coins} loading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
