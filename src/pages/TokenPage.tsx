
import React from 'react';
import Navbar from '@/components/Navbar';
import TokenHeroBannerExact from '@/components/token/TokenHeroBannerExact';
import { TokenInfoCards } from '@/components/token/TokenInfoCards';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <div className="pt-20">
        {/* New Full-width Banner */}
        <TokenHeroBannerExact />
        {/* 6 Simple Info Cards */}
        <TokenInfoCards />
      </div>
    </div>
  );
};

export default TokenPage;
