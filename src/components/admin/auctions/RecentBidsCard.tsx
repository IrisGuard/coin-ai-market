
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecentBidsCardProps {
  recentBids: any[] | undefined;
  bidsLoading: boolean;
  bidderProfiles: Record<string, any> | undefined;
}

const RecentBidsCard: React.FC<RecentBidsCardProps> = ({ 
  recentBids, 
  bidsLoading, 
  bidderProfiles 
}) => {
  return (
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
                    Bidder: {bidderProfiles?.[bid.bidder_id]?.name || 'Anonymous'} • 
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
  );
};

export default RecentBidsCard;
