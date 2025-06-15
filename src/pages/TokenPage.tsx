
import React from 'react';
import Navbar from '@/components/Navbar';
import { TokenCountdownBanner } from '@/components/token/TokenCountdownBanner';
import { TokenInfoCards } from '@/components/token/TokenInfoCards';
import { BuyTokensSection } from '@/components/token/BuyTokensSection';
import { WhitepaperRoadmapSection } from '@/components/token/WhitepaperRoadmapSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <div className="pt-20">
        {/* Full-width Countdown Banner */}
        <div className="px-4 mb-8">
          <TokenCountdownBanner />
        </div>
        
        {/* 6 Simple Info Cards */}
        <TokenInfoCards />
        
        {/* Token Purchase Section */}
        <BuyTokensSection />
        
        {/* Whitepaper & Roadmap */}
        <WhitepaperRoadmapSection />
        
        {/* FAQ Section */}
        <TokenFAQSection />
      </div>
    </div>
  );
};

export default TokenPage;
