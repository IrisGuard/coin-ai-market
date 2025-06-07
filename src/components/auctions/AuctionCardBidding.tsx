
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gavel } from 'lucide-react';
import { TimeRemaining } from '@/types/auction';

interface AuctionCardBiddingProps {
  auction: {
    id: string;
    current_bid: number;
    seller_id: string;
  };
  timeRemaining: TimeRemaining;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  placeBid: (auctionId: string) => void;
  userId?: string;
}

const AuctionCardBidding = ({
  auction,
  timeRemaining,
  bidAmount,
  setBidAmount,
  placeBid,
  userId
}: AuctionCardBiddingProps) => {
  const minBid = auction.current_bid + 1;

  return (
    <div className="space-y-2">
      {/* Bidding Section */}
      {!timeRemaining.expired && auction.seller_id !== userId && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`Min: $${minBid.toLocaleString()}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => placeBid(auction.id)}
              disabled={!bidAmount || parseFloat(bidAmount) <= auction.current_bid}
              className="flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              Bid
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Next bid must be at least ${minBid.toLocaleString()}
          </div>
        </div>
      )}

      {/* View Details Button */}
      <Link to={`/coin/${auction.id}`}>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </Link>
    </div>
  );
};

export default AuctionCardBidding;
