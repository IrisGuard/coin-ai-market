
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Gavel, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';

const AdminAuctionsTab = () => {
  // Get auction stats
  const { data: auctionStats, isLoading } = useQuery({
    queryKey: ['auction-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_auction_dashboard_data');
      if (error) throw error;
      return data;
    },
  });

  // Get active auctions
  const { data: activeAuctions, isLoading: auctionsLoading } = useQuery({
    queryKey: ['active-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles (name),
          auction_bids (
            amount,
            bidder_id,
            created_at,
            profiles (name)
          )
        `)
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString())
        .order('auction_end', { ascending: true });
      
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
          coins (name, year),
          profiles (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  const formatTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHighestBid = (bids: any[]) => {
    if (!bids || bids.length === 0) return 0;
    return Math.max(...bids.map(bid => bid.amount));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Auction Management</h3>
          <p className="text-sm text-muted-foreground">Monitor and manage coin auctions and bidding activity</p>
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
            <div className="text-2xl font-bold">{auctionStats?.auctions?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {auctionStats?.auctions?.ended || 0} ended today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bids Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auctionStats?.auctions?.bids_today || 0}</div>
            <p className="text-xs text-muted-foreground">new bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bid Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Math.round(auctionStats?.auctions?.avg_bid_amount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(((auctionStats?.auctions?.ended || 0) / Math.max(auctionStats?.auctions?.active + auctionStats?.auctions?.ended || 1, 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">completion rate</p>
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
              <div className="text-center py-8">Loading auctions...</div>
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
                      Year: {auction.year} • Listed by: {auction.profiles?.name || 'Unknown'}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="default">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeLeft(auction.auction_end)}
                      </Badge>
                      <Badge variant="outline">
                        Starting: €{auction.starting_bid || auction.price}
                      </Badge>
                      <Badge variant="outline">
                        Current: €{getHighestBid(auction.auction_bids || [])}
                      </Badge>
                      <Badge variant="outline">
                        {auction.auction_bids?.length || 0} bids
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      View Auction
                    </Button>
                    <Button size="sm" variant="outline">
                      Manage
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
          <CardTitle>Recent Bidding Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bidsLoading ? (
              <div className="text-center py-8">Loading bids...</div>
            ) : recentBids?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent bids found
              </div>
            ) : (
              recentBids?.map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">€{bid.amount} bid on {bid.coins?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      by {bid.profiles?.name || 'Anonymous'} • {new Date(bid.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={bid.is_winning ? "default" : "outline"}>
                      {bid.is_winning ? "Winning" : "Outbid"}
                    </Badge>
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
