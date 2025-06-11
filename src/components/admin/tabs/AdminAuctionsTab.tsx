
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminAuctionsTab = () => {
  const { data: auctionStats, isLoading } = useQuery({
    queryKey: ['auction-stats'],
    queryFn: async () => {
      const [liveAuctionsResult, bidsResult, completedAuctionsResult] = await Promise.all([
        supabase.from('coins').select('*').eq('is_auction', true).gt('auction_end', new Date().toISOString()),
        supabase.from('auction_bids').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*').eq('is_auction', true).lt('auction_end', new Date().toISOString())
      ]);

      return {
        live_auctions: liveAuctionsResult.data?.length || 0,
        total_bids: bidsResult.count || 0,
        completed_auctions: completedAuctionsResult.data?.length || 0,
        ending_soon: liveAuctionsResult.data?.filter(auction => 
          new Date(auction.auction_end) < new Date(Date.now() + 24 * 60 * 60 * 1000)
        ).length || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
      </div>
    );
  }

  const data = auctionStats || {
    live_auctions: 0,
    total_bids: 0,
    completed_auctions: 0,
    ending_soon: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Auction Management</h3>
          <p className="text-sm text-muted-foreground">Monitor auction activity and performance</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.live_auctions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_bids}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completed_auctions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ending Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ending_soon}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuctionsTab;
