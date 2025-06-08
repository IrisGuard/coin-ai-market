
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Users, Bot, Coins } from 'lucide-react';

interface PanelStatsCardsProps {
  totalStores: number;
  verifiedDealers: number;
  totalUsers: number;
  aiAnalysisCount: number;
  totalCoins: number;
}

const PanelStatsCards = ({
  totalStores,
  verifiedDealers,
  totalUsers,
  aiAnalysisCount,
  totalCoins
}: PanelStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
          <Store className="h-4 w-4 text-electric-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStores}</div>
          <p className="text-xs text-gray-600">
            {verifiedDealers} verified dealers
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-electric-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-gray-600">Registered collectors</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
          <Bot className="h-4 w-4 text-electric-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiAnalysisCount}</div>
          <p className="text-xs text-gray-600">AI recognition tasks</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Coins</CardTitle>
          <Coins className="h-4 w-4 text-electric-orange" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCoins}</div>
          <p className="text-xs text-gray-600">Active listings</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelStatsCards;
