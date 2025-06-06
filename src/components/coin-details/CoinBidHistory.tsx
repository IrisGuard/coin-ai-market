
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Gavel } from 'lucide-react';

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  profiles?: {
    full_name?: string;
    name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface CoinBidHistoryProps {
  bids: Bid[];
}

const CoinBidHistory = ({ bids }: CoinBidHistoryProps) => {
  if (bids.length === 0) return null;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          Bid History ({bids.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bids.slice(0, 5).map((bid, index) => {
            const bidderName = bid.profiles?.full_name || bid.profiles?.name || bid.profiles?.username || 'Anonymous';
            return (
              <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={bid.profiles?.avatar_url} />
                    <AvatarFallback>{bidderName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{bidderName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(bid.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${Number(bid.amount).toFixed(2)}</div>
                  {index === 0 && <Badge className="bg-yellow-500 text-white">Highest Bid</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinBidHistory;
