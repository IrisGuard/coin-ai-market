
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuctionActions = (userId?: string) => {
  const { toast } = useToast();
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});

  // Place bid function
  const placeBid = async (auctionId: string, auctions: any[]) => {
    const bidAmount = parseFloat(bidAmounts[auctionId] || '0');
    const auction = auctions.find(a => a.id === auctionId);
    
    if (!auction || !userId) return;

    if (bidAmount <= auction.current_bid) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than current bid of $${auction.current_bid}`,
        variant: "destructive"
      });
      return;
    }

    if (auction.seller_id === userId) {
      toast({
        title: "Error",
        description: "You cannot bid on your own auction",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('auction_bids')
        .insert({
          auction_id: auctionId,
          bidder_id: userId,
          amount: bidAmount
        });

      if (error) throw error;

      toast({
        title: "Bid Placed!",
        description: `Your bid of $${bidAmount} has been placed successfully`,
      });

      setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add to watchlist
  const addToWatchlist = async (coinId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: userId,
          listing_id: coinId
        });

      if (error) throw error;

      toast({
        title: "Added to Watchlist",
        description: "You'll be notified of updates on this auction"
      });

    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive"
      });
    }
  };

  return {
    bidAmounts,
    setBidAmounts,
    placeBid,
    addToWatchlist
  };
};
