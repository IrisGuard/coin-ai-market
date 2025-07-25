import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlaceBid } from '@/hooks/useBids';
import { SecurityUtils } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

interface CoinBidFormProps {
  coinId: string;
  currentHighBid?: number;
}

const CoinBidForm = ({ coinId, currentHighBid }: CoinBidFormProps) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const placeBid = usePlaceBid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Input validation
      const amount = parseFloat(bidAmount);
      const validation = SecurityUtils.validateBidAmount(amount);
      
      if (!validation.isValid) {
        toast({
          title: "Invalid bid amount",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      // Check minimum bid increment
      const minimumBid = Math.max(currentHighBid || 0, amount) + 0.01;
      if (amount < minimumBid) {
        toast({
          title: "Bid too low",
          description: `Minimum bid is $${minimumBid.toFixed(2)}`,
          variant: "destructive",
        });
        return;
      }

      // Rate limiting check
      if (!SecurityUtils.checkClientRateLimit('place_bid', 10, 300000)) { // 10 bids per 5 minutes
        toast({
          title: "Too many bids",
          description: "Please wait before placing another bid.",
          variant: "destructive",
        });
        return;
      }

      // Place the bid
      await placeBid.mutateAsync({ coinId, amount });
      setBidAmount('');
      
    } catch (error: unknown) {
      console.error('Bid placement error:', SecurityUtils.sanitizeForLogging(
        error instanceof Error ? { error: error.message } : { error: String(error) }
      ));
      toast({
        title: "Failed to place bid",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setBidAmount(value);
    }
  };

  const minimumBid = Math.max(currentHighBid || 0, parseFloat(bidAmount)) + 0.01;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place a Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bidAmount">Bid Amount (USD)</Label>
            <Input
              id="bidAmount"
              type="text"
              inputMode="decimal"
              value={bidAmount}
              onChange={handleBidAmountChange}
              placeholder={`Minimum: $${minimumBid.toFixed(2)}`}
              min={minimumBid}
              step="0.01"
              required
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Current price: ${minimumBid.toFixed(2)}
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !bidAmount || parseFloat(bidAmount) < minimumBid}
            className="w-full"
          >
            {isSubmitting ? 'Placing Bid...' : `Place Bid of $${bidAmount || '0.00'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CoinBidForm;
