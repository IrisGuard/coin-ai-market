
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Lock, Users } from 'lucide-react';

export const TokenHeader = () => {
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
        Join the next generation of AI-powered numismatic trading. Lock tokens, earn rewards, 
        and be part of the future of coin collecting and trading.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <TrendingUp className="w-4 h-4 mr-2" />
          AI-Powered Trading
        </Badge>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Lock className="w-4 h-4 mr-2" />
          Token Locking Rewards
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Users className="w-4 h-4 mr-2" />
          Referral Program
        </Badge>
      </div>
    </div>
  );
};
