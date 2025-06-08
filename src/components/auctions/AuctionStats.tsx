
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuctionStatsProps {
  endingSoonCount: number;
  hotAuctionsCount: number;
  totalValue: number;
  userBidsCount: number;
}

const AuctionStats: React.FC<AuctionStatsProps> = ({
  endingSoonCount,
  hotAuctionsCount,
  totalValue,
  userBidsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Ending Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{endingSoonCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hot Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hotAuctionsCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userBidsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionStats;
