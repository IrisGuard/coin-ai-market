
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Gavel, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useBidding } from '@/hooks/useBidding';
import { AuctionListing } from '@/types/auctionTypes';

interface BiddingInterfaceProps {
  auction: AuctionListing;
  currentUserBid?: number;
  isHighestBidder?: boolean;
}

const BiddingInterface: React.FC<BiddingInterfaceProps> = ({ 
  auction, 
  currentUserBid, 
  isHighestBidder 
}) => {
  const { placeBid, isPlacingBid, getMinimumBid, enableAutoBid, disableAutoBid, autoBidSettings } = useBidding();
  const [bidAmount, setBidAmount] = useState('');
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState('');

  const minimumBid = getMinimumBid(auction.current_price, auction.bid_increment);
  const hasAutoBid = autoBidSettings[auction.id];

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount < minimumBid) return;

    placeBid({
      auctionId: auction.id,
      amount,
      autoBidMax: autoBidEnabled ? parseFloat(maxAutoBid) : undefined
    });

    setBidAmount('');
    if (autoBidEnabled && maxAutoBid) {
      enableAutoBid(auction.id, parseFloat(maxAutoBid), auction.bid_increment);
    }
  };

  const handleQuickBid = (increment: number) => {
    const quickBidAmount = minimumBid + increment;
    placeBid({
      auctionId: auction.id,
      amount: quickBidAmount
    });
  };

  const toggleAutoBid = () => {
    if (hasAutoBid) {
      disableAutoBid(auction.id);
    } else if (maxAutoBid) {
      enableAutoBid(auction.id, parseFloat(maxAutoBid), auction.bid_increment);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          Place Your Bid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <Label className="text-sm text-muted-foreground">Current Bid</Label>
            <div className="text-lg font-bold text-green-600">
              ${auction.current_price.toLocaleString()}
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Minimum Bid</Label>
            <div className="text-lg font-semibold">
              ${minimumBid.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {isHighestBidder && (
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Highest Bidder
            </Badge>
          )}
          {currentUserBid && !isHighestBidder && (
            <Badge variant="outline">
              Your Bid: ${currentUserBid.toLocaleString()}
            </Badge>
          )}
          {hasAutoBid && (
            <Badge className="bg-blue-100 text-blue-800">
              Auto-bid Active
            </Badge>
          )}
          {auction.reserve_price && auction.current_price < auction.reserve_price && (
            <Badge variant="secondary">
              Reserve Not Met
            </Badge>
          )}
        </div>

        {/* Manual Bidding */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="bidAmount">Your Bid Amount</Label>
            <Input
              id="bidAmount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min: $${minimumBid}`}
              min={minimumBid}
              step={auction.bid_increment}
            />
          </div>

          <Button 
            onClick={handlePlaceBid}
            disabled={!bidAmount || parseFloat(bidAmount) < minimumBid || isPlacingBid}
            className="w-full"
            size="lg"
          >
            {isPlacingBid ? 'Placing Bid...' : `Bid $${bidAmount || '0'}`}
          </Button>
        </div>

        {/* Quick Bid Options */}
        <div className="space-y-2">
          <Label>Quick Bid Options</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBid(0)}
              disabled={isPlacingBid}
            >
              +${auction.bid_increment}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBid(auction.bid_increment * 2)}
              disabled={isPlacingBid}
            >
              +${auction.bid_increment * 3}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickBid(auction.bid_increment * 4)}
              disabled={isPlacingBid}
            >
              +${auction.bid_increment * 5}
            </Button>
          </div>
        </div>

        {/* Auto-Bidding */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoBid">Enable Auto-Bidding</Label>
            <Switch
              id="autoBid"
              checked={autoBidEnabled || !!hasAutoBid}
              onCheckedChange={setAutoBidEnabled}
            />
          </div>

          {autoBidEnabled && (
            <div>
              <Label htmlFor="maxAutoBid">Maximum Auto-Bid Amount</Label>
              <Input
                id="maxAutoBid"
                type="number"
                value={maxAutoBid}
                onChange={(e) => setMaxAutoBid(e.target.value)}
                placeholder="Enter maximum amount"
                min={minimumBid}
              />
            </div>
          )}

          {hasAutoBid && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-bid Active</div>
                  <div className="text-sm text-muted-foreground">
                    Max: ${hasAutoBid.maxAmount.toLocaleString()}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={toggleAutoBid}>
                  Disable
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Buyout Option */}
        {auction.buyout_price && (
          <div className="pt-4 border-t">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => placeBid({
                auctionId: auction.id,
                amount: auction.buyout_price!
              })}
              disabled={isPlacingBid}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Buy Now - ${auction.buyout_price.toLocaleString()}
            </Button>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Bid increment: ${auction.bid_increment}</div>
          {auction.reserve_price && (
            <div>Reserve price: ${auction.reserve_price.toLocaleString()}</div>
          )}
          <div>Shipping: ${auction.shipping_cost || 0}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiddingInterface;
