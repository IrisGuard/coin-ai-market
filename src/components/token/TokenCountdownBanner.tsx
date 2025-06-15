
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { Wallet, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const TokenCountdownBanner = () => {
  const { data: tokenInfo, isLoading } = useTokenInfo();
  const { data: cryptoPrices } = useCryptoPrices();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Target end date for countdown - this should come from Supabase
  const targetDate = new Date('2025-02-01T00:00:00Z').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleConnectWallet = () => {
    toast.info('Solana wallet connection functionality will be available when token is deployed.');
  };

  const handleBuyWithSOL = () => {
    toast.info('Purchase with SOL will be available when token is deployed.');
  };

  const currentPrice = tokenInfo?.current_price_usd || 0.1000;
  const totalRaised = 2847000; // This should come from Supabase
  const totalTarget = 5000000; // This should come from Supabase
  const progressPercentage = (totalRaised / totalTarget) * 100;

  return (
    <div className="w-full bg-gradient-to-r from-bg-primary via-bg-secondary to-bg-tertiary border border-border-custom-primary rounded-lg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Left Column - Token Info */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-text-primary mb-2">GCAI Token Sale</h1>
            <div className="text-2xl font-bold text-brand-primary mb-4">
              ${currentPrice.toFixed(4)} GCAI
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Raised:</span>
                <span className="text-text-primary font-semibold">${totalRaised.toLocaleString()}</span>
              </div>
              <div className="w-full bg-bg-secondary rounded-full h-2">
                <div 
                  className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Target:</span>
                <span className="text-text-primary font-semibold">${totalTarget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Center Column - Countdown Timer */}
          <div className="text-center">
            <div className="mb-4">
              <Clock className="w-8 h-8 mx-auto mb-2 text-brand-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Sale Ends In</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-bg-primary border border-border-custom-primary rounded-lg p-3">
                  <div className="text-2xl font-bold text-brand-primary">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-text-secondary">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="text-center lg:text-right">
            <div className="space-y-4">
              <div className="text-sm text-text-secondary mb-2">
                Supported Networks: SOL • USDC
              </div>
              
              <Button 
                onClick={handleConnectWallet}
                className="w-full lg:w-auto bg-bg-secondary border border-border-custom-primary text-text-primary hover:bg-bg-tertiary"
                variant="outline"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
              
              <Button 
                onClick={handleBuyWithSOL}
                className="w-full lg:w-auto bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold"
                size="lg"
              >
                Buy with SOL
              </Button>
              
              {cryptoPrices?.solana && (
                <div className="text-xs text-text-secondary">
                  SOL: ${cryptoPrices.solana.usd.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
