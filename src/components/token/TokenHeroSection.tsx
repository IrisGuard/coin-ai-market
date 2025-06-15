
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Clock, DollarSign } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export const TokenHeroSection = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 12, minutes: 30, seconds: 45 });
  
  const { data: tokenInfo } = useTokenInfo();
  const { data: walletData } = useWalletBalance();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const connectWallet = (walletType: string) => {
    // Simulate wallet connection
    setIsWalletConnected(true);
    setWalletAddress('7xKX...mN9p');
    console.log(`Connecting to ${walletType} wallet`);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            Global Coin AI Token
            <span className="text-brand-primary"> (GCAI)</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Connect Your Solana Wallet to Access the Future of AI-Powered Coin Recognition
          </p>
        </div>

        {/* Countdown Timer */}
        <Card className="mb-12 bg-gradient-to-r from-brand-warning to-brand-danger border-0">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-bold text-white">BUY NOW BEFORE PRICE RISE</h3>
            </div>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-sm text-white/80">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-sm text-white/80">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-sm text-white/80">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-sm text-white/80">SECONDS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Connection */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">
              Connect Your Solana Wallet
            </h2>
            
            {!isWalletConnected ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                  onClick={() => connectWallet('Phantom')}
                  className="h-16 text-lg bg-brand-secondary hover:bg-brand-secondary/90 text-white"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  Phantom
                </Button>
                <Button
                  onClick={() => connectWallet('Solflare')}
                  className="h-16 text-lg bg-brand-yellow hover:bg-brand-yellow/90 text-black"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  Solflare
                </Button>
                <Button
                  onClick={() => connectWallet('Backpack')}
                  className="h-16 text-lg bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  Backpack
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 bg-brand-success/10 text-brand-success px-6 py-3 rounded-lg">
                  <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                  <span className="font-semibold">Wallet Connected: {walletAddress}</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">
                  GCAI Balance: {walletData?.gcai_balance?.toLocaleString() || '0'} GCAI
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-brand-primary" />
              <div className="text-2xl font-bold text-text-primary">
                ${tokenInfo?.current_price_usd?.toFixed(4) || '0.1000'}
              </div>
              <div className="text-text-secondary">Current Price</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {tokenInfo?.total_supply?.toLocaleString() || '1,000,000,000'}
              </div>
              <div className="text-text-secondary">Total Supply</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-text-primary">
                {tokenInfo?.circulating_supply?.toLocaleString() || '250,000,000'}
              </div>
              <div className="text-text-secondary">Circulating Supply</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
