
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, TrendingUp, Users, DollarSign } from 'lucide-react';

interface AuctionStatsCardsProps {
  auctionStats: {
    active: number;
    bids_24h: number;
    avg_bid_amount: number;
    active_bidders_7d: number;
  } | undefined;
}

const AuctionStatsCards: React.FC<AuctionStatsCardsProps> = ({ auctionStats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
          <Gavel className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{auctionStats?.active || 0}</div>
          <p className="text-xs text-muted-foreground">
            live auctions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bids Today</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{auctionStats?.bids_24h || 0}</div>
          <p className="text-xs text-muted-foreground">bidding activity</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Bid Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{Math.round(auctionStats?.avg_bid_amount || 0)}</div>
          <p className="text-xs text-muted-foreground">average bid value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bidders</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{auctionStats?.active_bidders_7d || 0}</div>
          <p className="text-xs text-muted-foreground">unique participants</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionStatsCards;
