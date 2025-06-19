
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Crown, Bot } from 'lucide-react';
import { useAuction } from '@/hooks/useAuction';
import { AuctionBid } from '@/types/auctionTypes';
import { formatDistanceToNow } from 'date-fns';

interface BidHistoryProps {
  auctionId: string;
  showFullHistory?: boolean;
}

const BidHistory: React.FC<BidHistoryProps> = ({ auctionId, showFullHistory = false }) => {
  const { bidHistory, bidHistoryLoading } = useAuction(auctionId);

  if (bidHistoryLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Bid History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayBids = showFullHistory ? bidHistory : bidHistory?.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Bid History ({bidHistory?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!bidHistory || bidHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bids placed yet</p>
            <p className="text-sm">Be the first to bid on this auction!</p>
          </div>
        ) : (
          <ScrollArea className={showFullHistory ? "h-96" : "h-80"}>
            <div className="space-y-3">
              {displayBids?.map((bid: AuctionBid, index) => {
                const isWinning = index === 0;
                const bidderName = bid.profiles?.name || 'Anonymous Bidder';
                
                return (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isWinning 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={bid.profiles?.avatar_url} />
                          <AvatarFallback>
                            {bidderName[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isWinning && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
                        )}
                        {bid.is_auto_bid && (
                          <Bot className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bidderName}</span>
                          {bid.profiles?.verified_dealer && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Dealer
                            </Badge>
                          )}
                          {isWinning && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Highest Bid
                            </Badge>
                          )}
                          {bid.is_auto_bid && (
                            <Badge variant="outline" className="text-xs">
                              Auto-bid
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        isWinning ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        ${bid.amount.toLocaleString()}
                      </div>
                      {bid.auto_bid_max && bid.auto_bid_max > bid.amount && (
                        <div className="text-xs text-muted-foreground">
                          Max: ${bid.auto_bid_max.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        
        {!showFullHistory && bidHistory && bidHistory.length > 10 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-primary hover:underline">
              View all {bidHistory.length} bids
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BidHistory;
