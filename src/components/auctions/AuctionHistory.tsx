
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Clock, User, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface AuctionHistoryProps {
  auctionId?: string;
  userId?: string;
}

const AuctionHistory: React.FC<AuctionHistoryProps> = ({ auctionId, userId }) => {
  const { user } = useAuth();
  const currentUserId = userId || user?.id;

  // Fetch auction history - either for specific auction or user's history
  const { data: auctionHistory, isLoading } = useQuery({
    queryKey: ['auction-history', auctionId, currentUserId],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (
            id,
            name,
            image,
            year,
            grade,
            category
          ),
          profiles!seller_id (
            name,
            verified_dealer
          )
        `)
        .eq('listing_type', 'auction')
        .order('created_at', { ascending: false });

      // Filter by specific auction or user's auctions
      if (auctionId) {
        query = query.eq('id', auctionId);
      } else if (currentUserId) {
        query = query.eq('seller_id', currentUserId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!(auctionId || currentUserId)
  });

  // Fetch bids for the auctions
  const { data: bidsHistory } = useQuery({
    queryKey: ['bids-history', auctionId, currentUserId],
    queryFn: async () => {
      if (!auctionHistory || auctionHistory.length === 0) return [];

      const auctionIds = auctionHistory.map(auction => auction.id);
      
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          marketplace_listings!listing_id (
            coins (name, image)
          ),
          profiles!bidder_id (
            name,
            verified_dealer
          )
        `)
        .in('listing_id', auctionIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!(auctionHistory && auctionHistory.length > 0)
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Auction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (auction: any) => {
    const now = new Date();
    const endTime = new Date(auction.ends_at);
    
    if (auction.status === 'sold') {
      return <Badge className="bg-green-100 text-green-800">Sold</Badge>;
    } else if (auction.status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    } else if (endTime <= now) {
      return <Badge variant="secondary">Ended</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          {auctionId ? 'Auction Details' : 'Auction History'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!auctionHistory || auctionHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No auction history found</p>
            <p className="text-sm">
              {auctionId ? 'This auction has no history yet' : 'Start by creating your first auction!'}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {auctionHistory.map((auction) => {
                const relatedBids = bidsHistory?.filter(bid => bid.listing_id === auction.id) || [];
                const highestBid = relatedBids.reduce((max, bid) => 
                  bid.amount > max ? bid.amount : max, auction.starting_price || 0
                );

                return (
                  <div key={auction.id} className="border rounded-lg p-4 space-y-3">
                    {/* Auction Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {auction.coins?.image && (
                          <img 
                            src={auction.coins.image} 
                            alt={auction.coins.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{auction.coins?.name || 'Unknown Coin'}</h4>
                          <p className="text-sm text-gray-600">
                            {auction.coins?.year} • {auction.coins?.grade} • {auction.coins?.category}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(auction)}
                    </div>

                    {/* Auction Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>
                          Starting: ${auction.starting_price?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span>
                          Current: ${auction.current_price?.toLocaleString() || highestBid.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span>
                          {auction.ends_at ? 
                            formatDistanceToNow(new Date(auction.ends_at), { addSuffix: true }) :
                            'No end time'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    {auction.profiles && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{auction.profiles.name}</span>
                        {auction.profiles.verified_dealer && (
                          <Badge variant="outline" className="text-xs">
                            Verified Dealer
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Bid Count */}
                    {relatedBids.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {relatedBids.length} bid{relatedBids.length !== 1 ? 's' : ''} placed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionHistory;
