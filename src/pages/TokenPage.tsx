
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { TokenHeader } from '@/components/token/TokenHeader';
import { TokenStats } from '@/components/token/TokenStats';
import { TokenPurchase } from '@/components/token/TokenPurchase';
import { TokenLocking } from '@/components/token/TokenLocking';
import { TokenReferrals } from '@/components/token/TokenReferrals';
import { TokenActivity } from '@/components/token/TokenActivity';
import { TokenWallet } from '@/components/token/TokenWallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TokenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TokenHeader />
          <TokenStats />
          
          <Tabs defaultValue="purchase" className="mt-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
              <TabsTrigger value="lock">Lock Tokens</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="purchase" className="mt-8">
              <TokenPurchase />
            </TabsContent>
            
            <TabsContent value="lock" className="mt-8">
              <TokenLocking />
            </TabsContent>
            
            <TabsContent value="referrals" className="mt-8">
              <TokenReferrals />
            </TabsContent>
            
            <TabsContent value="wallet" className="mt-8">
              <TokenWallet />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-8">
              <TokenActivity />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
