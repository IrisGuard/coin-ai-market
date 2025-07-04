
import React from 'react';
import { Button } from '@/components/ui/button';
import { TokenStats } from './TokenStats';
import { TokenHeader } from './TokenHeader';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { Wallet, TrendingUp, Lock } from 'lucide-react';

export const TokenHeroSection = () => {
  const { data: tokenInfo, isLoading } = useTokenInfo();

  const handleConnectWallet = () => {
    console.log('Connect wallet functionality');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <div className="max-w-6xl mx-auto">
        <TokenHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-text-primary leading-tight">
                Join the Future of
                <span className="text-brand-primary block">AI-Powered Trading</span>
              </h1>
              
              <p className="text-xl text-text-secondary leading-relaxed">
                GCAI Token powers the next generation of numismatic AI recognition. 
                Lock tokens to earn platform shares and participate in revenue distribution.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-bg-primary/50 rounded-lg border border-border-custom-primary">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-brand-success" />
                  <div>
                    <div className="text-sm text-text-secondary">Current Price</div>
                    <div className="text-lg font-bold text-text-primary">
                      {isLoading ? 'Loading...' : `$${tokenInfo?.current_price_usd?.toFixed(4) || '0.0000'}`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-bg-primary/50 rounded-lg border border-border-custom-primary">
                <div className="flex items-center gap-3">
                  <Lock className="w-8 h-8 text-brand-warning" />
                  <div>
                    <div className="text-sm text-text-secondary">Total Supply</div>
                    <div className="text-lg font-bold text-text-primary">
                      {isLoading ? 'Loading...' : `${(tokenInfo?.total_supply || 0).toLocaleString()} GCAI`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleConnectWallet}
                size="lg" 
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white font-semibold px-8 py-4 text-lg"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>

          {/* Right Column - Token Stats */}
          <div className="space-y-6">
            <TokenStats />
          </div>
        </div>
      </div>
    </section>
  );
};
