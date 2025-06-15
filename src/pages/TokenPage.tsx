
import React from 'react';
import Navbar from '@/components/Navbar';
import TokenHeroBannerExact from '@/components/token/TokenHeroBannerExact';
import { TokenInfoCards } from '@/components/token/TokenInfoCards';
import { WhitepaperRoadmapSection } from '@/components/token/WhitepaperRoadmapSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <div className="pt-20">
        {/* Hero Banner */}
        <TokenHeroBannerExact />
        {/* 6 Staking Cards */}
        <TokenInfoCards />
        {/* Whitepaper & Roadmap */}
        <WhitepaperRoadmapSection />
        {/* FAQ Section */}
        <TokenFAQSection />
      </div>
    </div>
  );
};

export default TokenPage;
