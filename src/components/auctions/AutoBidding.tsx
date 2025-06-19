
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, AlertTriangle } from 'lucide-react';
import { useBidding } from '@/hooks/useBidding';
import { AuctionListing } from '@/types/auctionTypes';

interface AutoBiddingProps {
  auction: AuctionListing;
}

const AutoBidding: React.FC<AutoBiddingProps> = ({ auction }) => {
  const { autoBidSettings, enableAutoBid, disableAutoBid } = useBidding();
  const [maxAmount, setMaxAmount] = useState('');
  const [increment, setIncrement] = useState(auction.bid_increment.toString());
  const [stopAtReserve, setStopAtReserve] = useState(false);

  const currentAutoBid = autoBidSettings[auction.id];
  const isActive = !!currentAutoBid;

  const handleEnable = () => {
    const max = parseFloat(maxAmount);
    const inc = parseFloat(increment);
    
    if (!max || max <= auction.current_price) {
      return;
    }

    enableAutoBid(auction.id, max, inc);
    setMaxAmount('');
  };

  const handleDisable = () => {
    disableAutoBid(auction.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Auto-Bidding
          {isActive && (
            <Badge className="bg-blue-100 text-blue-800">Active</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isActive ? (
          <div className="space-y-4">
            {/* Active Auto-Bid Status */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Auto-bidding is active</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <div>Maximum bid: ${currentAutoBid.maxAmount.toLocaleString()}</div>
                    <div>Increment: ${currentAutoBid.increment}</div>
                    <div>Current bid: ${auction.current_price.toLocaleString()}</div>
                    <div>Remaining budget: ${(currentAutoBid.maxAmount - auction.current_price).toLocaleString()}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisable}>
                  Disable
                </Button>
              </div>
            </div>

            {/* Auto-Bid Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget used</span>
                <span>
                  {Math.round(((auction.current_price / currentAutoBid.maxAmount) * 100))}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (auction.current_price / currentAutoBid.maxAmount) * 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Warnings */}
            {auction.current_price >= currentAutoBid.maxAmount * 0.9 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">Budget almost exhausted</div>
                  <div>Consider increasing your maximum bid amount</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Setup Auto-Bidding */}
            <div className="text-sm text-muted-foreground">
              Let our system automatically place bids for you up to your maximum amount.
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="maxAmount">Maximum Bid Amount ($)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder={`Min: ${auction.current_price + auction.bid_increment}`}
                  min={auction.current_price + auction.bid_increment}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current bid: ${auction.current_price.toLocaleString()}
                </div>
              </div>

              <div>
                <Label htmlFor="increment">Bid Increment ($)</Label>
                <Input
                  id="increment"
                  type="number"
                  value={increment}
                  onChange={(e) => setIncrement(e.target.value)}
                  min={auction.bid_increment}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Minimum: ${auction.bid_increment}
                </div>
              </div>

              {auction.reserve_price && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="stopAtReserve"
                    checked={stopAtReserve}
                    onCheckedChange={setStopAtReserve}
                  />
                  <Label htmlFor="stopAtReserve" className="text-sm">
                    Stop bidding once reserve price is met (${auction.reserve_price.toLocaleString()})
                  </Label>
                </div>
              )}
            </div>

            <Button 
              onClick={handleEnable}
              disabled={!maxAmount || parseFloat(maxAmount) <= auction.current_price}
              className="w-full"
            >
              <Bot className="h-4 w-4 mr-2" />
              Enable Auto-Bidding
            </Button>

            {/* How it works */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                How Auto-Bidding Works
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• We'll automatically bid when you're outbid</li>
                <li>• Bids are placed incrementally up to your maximum</li>
                <li>• You'll be notified of all bidding activity</li>
                <li>• You can disable auto-bidding at any time</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoBidding;
