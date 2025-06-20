
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gavel, TrendingUp, Users, Clock, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminAuctionsTab = () => {
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    liveAuctions: 0,
    totalBids: 0,
    averageBid: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAuctions();
    fetchBids();
    fetchStats();
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey(name, email)
        `)
        .eq('is_auction', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          coins!bids_coin_id_fkey(name),
          profiles!bids_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [auctionsRes, bidsRes] = await Promise.all([
        supabase.from('coins').select('auction_end').eq('is_auction', true),
        supabase.from('bids').select('amount')
      ]);

      const totalAuctions = auctionsRes.data?.length || 0;
      const liveAuctions = auctionsRes.data?.filter(a => 
        a.auction_end && new Date(a.auction_end) > new Date()
      ).length || 0;
      const totalBids = bidsRes.data?.length || 0;
      const averageBid = totalBids > 0 ? 
        (bidsRes.data?.reduce((sum, b) => sum + (b.amount || 0), 0) / totalBids) : 0;

      setStats({
        totalAuctions,
        liveAuctions,
        totalBids,
        averageBid
      });
    } catch (error) {
      console.error('Error fetching auction stats:', error);
    }
  };

  const filteredAuctions = auctions.filter(auction => 
    auction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLiveAuction = (auctionEnd) => {
    return auctionEnd && new Date(auctionEnd) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Auction Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAuctions}</div>
            <p className="text-xs text-muted-foreground">All auction listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Auctions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.liveAuctions}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">All bid activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageBid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per bid amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Auction Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Auction Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchAuctions}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAuctions.map((auction) => (
              <div key={auction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{auction.name}</span>
                    <Badge className={isLiveAuction(auction.auction_end) ? 'bg-green-600' : 'bg-gray-600'}>
                      {isLiveAuction(auction.auction_end) ? 'LIVE' : 'ENDED'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Seller: {auction.profiles?.email || 'Unknown'} • 
                    {auction.auction_end ? 
                      ` Ends: ${new Date(auction.auction_end).toLocaleDateString()}` : 
                      ' No end date'
                    }
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">Starting: ${auction.starting_bid || auction.price}</div>
                  <div className="text-sm text-muted-foreground">
                    Reserve: ${auction.reserve_price || 'None'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bids */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Bid Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bids.slice(0, 10).map((bid) => (
              <div key={bid.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{bid.coins?.name || 'Unknown Coin'}</div>
                  <div className="text-sm text-muted-foreground">
                    Bidder: {bid.profiles?.email || 'Anonymous'} • 
                    {new Date(bid.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${bid.amount}</div>
                  <Badge className={bid.is_winning ? 'bg-green-600' : 'bg-gray-600'}>
                    {bid.is_winning ? 'WINNING' : 'OUTBID'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuctionsTab;
