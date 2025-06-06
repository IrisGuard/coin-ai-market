
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, DollarSign, Clock, TrendingDown, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface WatchlistStatsProps {
  totalItems: number;
  totalValue: number;
  auctionItems: number;
  priceDrops: number;
  activeAlerts: number;
}

const WatchlistStats = ({ 
  totalItems, 
  totalValue, 
  auctionItems, 
  priceDrops, 
  activeAlerts 
}: WatchlistStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold">{totalItems}</div>
          <div className="text-sm text-gray-600">Watching</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
          <div className="text-2xl font-bold">{auctionItems}</div>
          <div className="text-sm text-gray-600">Auctions</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold">{priceDrops}</div>
          <div className="text-sm text-gray-600">Price Drops</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Bell className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold">{activeAlerts}</div>
          <div className="text-sm text-gray-600">Active Alerts</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WatchlistStats;
