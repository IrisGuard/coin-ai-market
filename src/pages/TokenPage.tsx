
import React from 'react';
import Navbar from '@/components/Navbar';
import TokenHeroBannerExact from '@/components/token/TokenHeroBannerExact';
import { WhitepaperSection } from '@/components/token/WhitepaperSection';
import { RoadmapSection } from '@/components/token/RoadmapSection';
import { TokenomicsSection } from '@/components/token/TokenomicsSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';
import { TokenLocking } from '@/components/token/TokenLocking';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <main className="pt-20 flex flex-col gap-0">
        {/* Hero Banner */}
        <TokenHeroBannerExact />
        {/* Token Locking Section */}
        <section className="flex w-full justify-center py-12 px-4 md:px-2 bg-slate-50">
          <div className="max-w-4xl w-full">
            <TokenLocking />
          </div>
        </section>
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
