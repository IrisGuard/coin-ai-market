
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActiveAuctionsCardProps {
  activeAuctions: any[] | undefined;
  auctionsLoading: boolean;
}

const ActiveAuctionsCard: React.FC<ActiveAuctionsCardProps> = ({ 
  activeAuctions, 
  auctionsLoading 
}) => {
  return (
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
  );
};

export default ActiveAuctionsCard;
