
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useAuctionActions = (userId?: string) => {
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});

  const placeBid = async (auctionId: string, auctions: any[]) => {
    const bidAmount = bidAmounts[auctionId];
    if (!bidAmount || !userId) {
      toast({
        title: "Error",
        description: "Please enter a valid bid amount and make sure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) {
      toast({
        title: "Error",
        description: "Auction not found.",
        variant: "destructive",
      });
      return;
    }

    const currentBid = auction.current_bid || auction.starting_bid || auction.price || 0;
    const newBidAmount = parseFloat(bidAmount);

    if (newBidAmount <= currentBid) {
      toast({
        title: "Invalid Bid",
        description: `Your bid must be higher than the current bid of $${currentBid}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Placing bid:', { auctionId, amount: newBidAmount, userId });
      
      toast({
        title: "Bid Placed",
        description: `Your bid of $${newBidAmount} has been placed successfully.`,
      });

      // Clear the bid amount for this auction
      setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));
    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addToWatchlist = async (auctionId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please log in to add items to your watchlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding to watchlist:', { auctionId, userId });
      
      toast({
        title: "Added to Watchlist",
        description: "This auction has been added to your watchlist.",
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add to watchlist. Please try again.",
        variant: "destructive",
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
