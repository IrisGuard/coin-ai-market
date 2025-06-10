
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Users, TrendingUp } from 'lucide-react';

interface MarketplaceStatsCardsProps {
  dealersCount: number;
  registeredUsers: number;
  listedCoins: number;
}

const MarketplaceStatsCards: React.FC<MarketplaceStatsCardsProps> = ({
  dealersCount,
  registeredUsers,
  listedCoins
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active User Stores</CardTitle>
          <Store className="h-4 w-4 text-electric-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dealersCount}</div>
          <p className="text-xs text-gray-600">Verified dealers worldwide</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
          <Users className="h-4 w-4 text-electric-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{registeredUsers}</div>
          <p className="text-xs text-gray-600">Total platform users</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Listed Coins</CardTitle>
          <TrendingUp className="h-4 w-4 text-electric-orange" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{listedCoins}</div>
          <p className="text-xs text-gray-600">Active listings</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceStatsCards;
