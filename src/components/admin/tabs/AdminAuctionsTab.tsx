
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Gavel, TrendingUp, Users, DollarSign } from 'lucide-react';

interface AuctionData {
  auctions: {
    active: number;
    ended: number;
    bids_today: number;
    avg_bid_amount: number;
  };
}

const AdminAuctionsTab = () => {
  // Get auction dashboard data
  const { data: auctionDataRaw, isLoading } = useQuery({
    queryKey: ['auction-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_auction_dashboard_data');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Safely cast the data
  const auctionData = auctionDataRaw as AuctionData | null;

  // Get active auctions
  const { data: activeAuctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ['active-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (name)
        `)
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString())
        .order('auction_end', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get recent bids
  const { data: recentBids, isLoading: bidsLoading } = useQuery({
    queryKey: ['recent-bids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_bids')
        .select(`
          *,
          profiles!auction_bids_bidder_id_fkey (name),
          coins!auction_bids_auction_id_fkey (name, year)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Auction Management</h3>
          <p className="text-sm text-muted-foreground">Monitor auction activity, bids, and performance</p>
        </div>
      </div>

      {/* Auction Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auctionData?.auctions?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {auctionData?.auctions?.ended || 0} ended auctions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bids Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auctionData?.auctions?.bids_today || 0}</div>
            <p className="text-xs text-muted-foreground">bidding activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{Math.round(auctionData?.auctions?.avg_bid_amount || 0)}</div>
            <p className="text-xs text-muted-foreground">average bid value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bidders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentBids?.length || 0}</div>
            <p className="text-xs text-muted-foreground">unique participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Auctions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auctionsLoading ? (
              <div className="text-center py-8">Loading active auctions...</div>
            ) : activeAuctions?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active auctions found
              </div>
            ) : (
              activeAuctions?.map((auction) => (
                <div key={auction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{auction.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Year: {auction.year} • Owner: {auction.profiles?.name || 'Unknown'}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="default">Live Auction</Badge>
                      <Badge variant="outline">Starting: €{auction.starting_bid}</Badge>
                      <Badge variant="outline">
                        Ends: {new Date(auction.auction_end).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      View Auction
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bids */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bidsLoading ? (
              <div className="text-center py-8">Loading recent bids...</div>
            ) : recentBids?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent bids found
              </div>
            ) : (
              recentBids?.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">€{bid.amount}</div>
                    <div className="text-sm text-muted-foreground">
                      Bidder: {bid.profiles?.name || 'Anonymous'} • 
                      Coin: {bid.coins?.name || 'Unknown'} ({bid.coins?.year})
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={bid.is_winning ? "default" : "secondary"}>
                        {bid.is_winning ? "Winning Bid" : "Outbid"}
                      </Badge>
                      <Badge variant="outline">
                        {new Date(bid.created_at).toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuctionsTab;
