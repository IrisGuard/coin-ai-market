
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LiveMarketplaceHeaderProps {
  coinsCount: number;
}

const LiveMarketplaceHeader = ({ coinsCount }: LiveMarketplaceHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Live Marketplace</h2>
          <Badge className="bg-green-100 text-green-800">
            {coinsCount} Active Listings
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Updates every 10 seconds
        </div>
      </div>
    </div>
  );
};

export default LiveMarketplaceHeader;
