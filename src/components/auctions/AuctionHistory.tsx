
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Trophy, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface AuctionHistoryItem {
  id: string;
  auction_id: string;
  event_type: string;
  event_data: any;
  timestamp: string;
  marketplace_listings?: {
    id: string;
    coins?: {
      name: string;
      image: string;
    };
  };
}

const AuctionHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('participated');

  const { data: participatedAuctions, isLoading: participatedLoading } = useQuery({
    queryKey: ['auction-history-participated', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          marketplace_listings!listing_id (
            *,
            coins (*)
          )
        `)
        .eq('bidder_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: wonAuctions, isLoading: wonLoading } = useQuery({
    queryKey: ['auction-history-won', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          marketplace_listings!listing_id (
            *,
            coins (*)
          )
        `)
        .eq('bidder_id', user.id)
        .eq('is_winning', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: watchedAuctions, isLoading: watchedLoading } = useQuery({
    queryKey: ['auction-history-watched', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          *,
          marketplace_listings!listing_id (
            *,
            coins (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <Trophy className="h-4 w-4 text-green-600" />;
      case 'lost':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAuctionItem = (item: any, type: 'bid' | 'won' | 'watched') => {
    const auction = item.marketplace_listings;
    const coin = auction?.coins;
    
    let status = 'active';
    if (auction?.status === 'ended' || auction?.status === 'sold') {
      status = item.is_winning ? 'won' : 'lost';
    }

    return (
      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <img
          src={coin?.image || '/placeholder-coin.jpg'}
          alt={coin?.name || 'Coin'}
          className="w-16 h-16 rounded-lg object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm truncate">{coin?.name || 'Unknown Coin'}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(status)}
                <Badge className={getStatusColor(status)}>
                  {status === 'won' ? 'Won' : status === 'lost' ? 'Lost' : 'Active'}
                </Badge>
                {type === 'bid' && (
                  <Badge variant="outline">
                    Your Bid: ${item.amount?.toLocaleString()}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium">
                ${auction?.current_price?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          {auction?.ends_at && new Date(auction.ends_at) > new Date() && (
            <div className="text-xs text-muted-foreground mt-2">
              Ends {formatDistanceToNow(new Date(auction.ends_at), { addSuffix: true })}
            </div>
          )}
        </div>
        
        <Button variant="outline" size="sm">
          View
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Auction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participated">Participated</TabsTrigger>
            <TabsTrigger value="won">Won</TabsTrigger>
            <TabsTrigger value="watched">Watched</TabsTrigger>
          </TabsList>
          
          <TabsContent value="participated" className="mt-4">
            <ScrollArea className="h-96">
              {participatedLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !participatedAuctions || participatedAuctions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No auction participation history</p>
                  <p className="text-sm">Start bidding on auctions to see your history here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {participatedAuctions.map((item) => renderAuctionItem(item, 'bid'))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="won" className="mt-4">
            <ScrollArea className="h-96">
              {wonLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !wonAuctions || wonAuctions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No won auctions yet</p>
                  <p className="text-sm">Keep bidding to win your first auction!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wonAuctions.map((item) => renderAuctionItem(item, 'won'))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="watched" className="mt-4">
            <ScrollArea className="h-96">
              {watchedLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !watchedAuctions || watchedAuctions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No watched auctions</p>
                  <p className="text-sm">Add auctions to your watchlist to track them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {watchedAuctions.map((item) => renderAuctionItem(item, 'watched'))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuctionHistory;
