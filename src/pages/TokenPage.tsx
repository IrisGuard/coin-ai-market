
import React from 'react';
import Navbar from '@/components/Navbar';
import TokenHeroBannerExact from '@/components/token/TokenHeroBannerExact';
import { TokenInfoCards } from '@/components/token/TokenInfoCards';
import { WhitepaperRoadmapSection } from '@/components/token/WhitepaperRoadmapSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';
import { TokenomicsSection } from '@/components/token/TokenomicsSection';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <main className="pt-20 flex flex-col gap-0">
        {/* Hero Banner */}
        <TokenHeroBannerExact />
        {/* 6 Staking Cards, ALWAYS IMMEDIATELY BELOW Banner, 2x3, responsive */}
        <TokenInfoCards />
        {/* Whitepaper & Roadmap full-width, content-first */}
        <WhitepaperRoadmapSection />
        {/* Tokenomics full-width, vertically-rich, advanced */}
        <TokenomicsSection />
        {/* FAQ Section */}
        <TokenFAQSection />
      </main>
    </div>
  );
};

export default TokenPage;
