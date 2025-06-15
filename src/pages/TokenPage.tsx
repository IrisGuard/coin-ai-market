
import React from 'react';
import Navbar from '@/components/Navbar';
import { TokenHeroSection } from '@/components/token/TokenHeroSection';
import { TokenLockingSection } from '@/components/token/TokenLockingSection';
import { ActiveLocksSection } from '@/components/token/ActiveLocksSection';
import { BuyTokensSection } from '@/components/token/BuyTokensSection';
import { ReferralSection } from '@/components/token/ReferralSection';
import { TokenomicsSection } from '@/components/token/TokenomicsSection';
import { WhitepaperRoadmapSection } from '@/components/token/WhitepaperRoadmapSection';
import { TokenFAQSection } from '@/components/token/TokenFAQSection';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <Navbar />
      <div className="pt-20">
        {/* 1. Connect Wallet Section - Top */}
        <TokenHeroSection />
        
        {/* 2. Token Locking Section - 6 Cards Grid */}
        <TokenLockingSection />
        
        {/* 3. Active Locks Table */}
        <ActiveLocksSection />
        
        {/* 4. Buy Tokens Section */}
        <BuyTokensSection />
        
        {/* 5. Referral System */}
        <ReferralSection />
        
        {/* 6. Tokenomics Section */}
        <TokenomicsSection />
        
        {/* 7. Whitepaper & Roadmap */}
        <WhitepaperRoadmapSection />
        
        {/* 8. FAQ Section - Last */}
        <TokenFAQSection />
      </div>
    </div>
  );
};

export default TokenPage;
