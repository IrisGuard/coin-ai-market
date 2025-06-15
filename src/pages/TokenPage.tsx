
import React from 'react';
import Navbar from '@/components/Navbar';
import { TokenHeroSection } from '@/components/token/TokenHeroSection';
import { TokenLockingSection } from '@/components/token/TokenLockingSection';
import { BuyTokensSection } from '@/components/token/BuyTokensSection';
import { WhitepaperRoadmapSection } from '@/components/token/WhitepaperRoadmapSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <div className="pt-20">
        {/* Hero Section with Token Stats */}
        <TokenHeroSection />
        
        {/* Token Locking Options - 6 Cards Grid */}
        <TokenLockingSection />
        
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
