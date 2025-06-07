
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, TrendingUp } from 'lucide-react';

interface AuctionStatsProps {
  stats: {
    total: number;
    ending_soon: number;
    my_bids: number;
  };
}

const AuctionStats: React.FC<AuctionStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-gray-600 text-sm">Total Auctions</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.ending_soon}</p>
              <p className="text-gray-600 text-sm">Ending Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.my_bids}</p>
              <p className="text-gray-600 text-sm">My Bids</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionStats;
