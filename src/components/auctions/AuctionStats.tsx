
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, TrendingUp, DollarSign, Users } from 'lucide-react';

interface AuctionStatsProps {
  endingSoonCount: number;
  hotAuctionsCount: number;
  totalValue: number;
  userBidsCount: number;
}

const AuctionStats = ({ endingSoonCount, hotAuctionsCount, totalValue, userBidsCount }: AuctionStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <Timer className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold">{endingSoonCount}</div>
          <div className="text-sm text-gray-600">Ending Soon</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold">{hotAuctionsCount}</div>
          <div className="text-sm text-gray-600">Hot Auctions</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold">{userBidsCount}</div>
          <div className="text-sm text-gray-600">My Active Bids</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionStats;
