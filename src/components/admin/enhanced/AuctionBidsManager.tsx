
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gavel, TrendingUp, Eye, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AuctionBidsManager = () => {
  const { data: auctionBids, isLoading } = useQuery({
    queryKey: ['auction-bids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_bids')
        .select(`
          *,
          profiles:bidder_id(name, email),
          coins:auction_id(name, image, grade)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: activeAuctions } = useQuery({
    queryKey: ['active-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString())
        .order('auction_end', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    totalBids: auctionBids?.length || 0,
    activeAuctions: activeAuctions?.length || 0,
    totalBidValue: auctionBids?.reduce((sum, bid) => sum + (bid.amount || 0), 0) || 0,
    uniqueBidders: new Set(auctionBids?.map(bid => bid.bidder_id)).size
  };

  const winningBids = auctionBids?.filter(bid => bid.is_winning) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalBids}</div>
            <p className="text-xs text-muted-foreground">Total Bids</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.activeAuctions}</div>
            <p className="text-xs text-muted-foreground">Active Auctions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">${stats.totalBidValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Bid Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.uniqueBidders}</div>
            <p className="text-xs text-muted-foreground">Unique Bidders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-6 w-6 text-blue-600" />
              Recent Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Auction</TableHead>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctionBids?.slice(0, 10).map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {bid.coins?.image && (
                          <img 
                            src={bid.coins.image} 
                            alt={bid.coins?.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-sm">{bid.coins?.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{bid.profiles?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${bid.amount?.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={bid.is_winning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {bid.is_winning ? 'Winning' : 'Outbid'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(bid.created_at).toLocaleTimeString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Active Auctions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coin</TableHead>
                  <TableHead>Current Bid</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>Ends</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAuctions?.slice(0, 10).map((auction) => {
                  const auctionBidCount = auctionBids?.filter(bid => bid.auction_id === auction.id).length || 0;
                  const highestBid = auctionBids
                    ?.filter(bid => bid.auction_id === auction.id)
                    ?.sort((a, b) => (b.amount || 0) - (a.amount || 0))[0];
                  
                  return (
                    <TableRow key={auction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img 
                            src={auction.image} 
                            alt={auction.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium text-sm">{auction.name}</div>
                            <div className="text-xs text-muted-foreground">{auction.grade}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${(highestBid?.amount || auction.starting_bid || 0).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{auctionBidCount} bids</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(auction.auction_end).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuctionBidsManager;
