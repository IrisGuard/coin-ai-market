
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Lock, Loader2 } from 'lucide-react';
import { useTokenInfo } from '@/hooks/useTokenInfo';

export const TokenHeader = () => {
  const { data: tokenInfo, isLoading } = useTokenInfo();
  const isTokenDeployed = !!tokenInfo?.current_price_usd;

  if (isLoading) {
    return (
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Loading GCAI Token Platform...
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Coins className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        GCAI Token Platform
      </h1>
      
      <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
        {isTokenDeployed 
          ? "Join the next generation of AI-powered numismatic trading. Lock tokens, earn rewards, and be part of the future of coin collecting and trading."
          : "Get ready for the next generation of AI-powered numismatic trading. Token launch coming soon with locking rewards and platform revenue sharing."}
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Badge 
          variant="outline" 
          className={`${isTokenDeployed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isTokenDeployed ? 'Live AI Trading' : 'AI-Powered Trading'}
        </Badge>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Lock className="w-4 h-4 mr-2" />
          {isTokenDeployed ? 'Active Locking Rewards' : 'Token Locking Rewards'}
        </Badge>
        {!isTokenDeployed && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Coins className="w-4 h-4 mr-2" />
            Coming Soon
          </Badge>
        )}
      </div>
    </div>
  );
};
