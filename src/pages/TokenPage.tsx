
import React from 'react';
import Navbar from '@/components/Navbar';
import TokenHeroBannerExact from '@/components/token/TokenHeroBannerExact';
import { WhitepaperSection } from '@/components/token/WhitepaperSection';
import { RoadmapSection } from '@/components/token/RoadmapSection';
import { TokenomicsSection } from '@/components/token/TokenomicsSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';
import { TokenLockingSection } from '@/components/token/TokenLockingSection';
import { UserDashboard } from '@/components/token/UserDashboard';
import { BuyTokensSection } from '@/components/token/BuyTokensSection';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <main className="pt-20 flex flex-col gap-0">
        {/* Hero Banner */}
        <TokenHeroBannerExact />
        {/* User Dashboard */}
        <UserDashboard />
        {/* Buy Tokens Section */}
        <BuyTokensSection />
        {/* Token Locking Section (dynamic staking/bonus lock grid) */}
        <TokenLockingSection />
        {/* Whitepaper in box-style */}
        <WhitepaperSection />
        {/* Roadmap in box-style */}
        <RoadmapSection />
        {/* Tokenomics in box-style */}
        <TokenomicsSection />
        {/* FAQ Section */}
        <TokenFAQSection />
      </main>
    </div>
  );
};

export default TokenPage;
