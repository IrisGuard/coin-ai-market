
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuctionBid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

export const useAuctionBids = (auctionId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bids, setBids] = useState<AuctionBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Fetch bids for the auction
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data, error } = await supabase
          .from('auction_bids')
          .select(`
            *,
            profiles:bidder_id(name, avatar_url)
          `)
          .eq('auction_id', auctionId)
          .order('amount', { ascending: false });

        if (error) throw error;
        setBids(data || []);
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (auctionId) {
      fetchBids();
    }
  }, [auctionId]);

  // Set up real-time subscription for new bids
  useEffect(() => {
    if (!auctionId) return;

    const channel = supabase
      .channel(`auction_${auctionId}_bids`)
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'auction_bids',
          filter: `auction_id=eq.${auctionId}`
        },
        async (payload) => {
          // Fetch the complete bid with profile data
          const { data: newBidData } = await supabase
            .from('auction_bids')
            .select(`
              *,
              profiles:bidder_id(name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newBidData) {
            setBids(prev => {
              const updated = [newBidData, ...prev.filter(bid => bid.id !== newBidData.id)];
              return updated.sort((a, b) => b.amount - a.amount);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  // Place a new bid
  const placeBid = async (amount: number) => {
    if (!user?.id || !auctionId) {
      toast({
        title: "Error",
        description: "You must be logged in to place a bid",
        variant: "destructive"
      });
      return false;
    }

    const currentHighBid = bids[0]?.amount || 0;
    if (amount <= currentHighBid) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than current bid of $${currentHighBid}`,
        variant: "destructive"
      });
      return false;
    }

    setIsPlacingBid(true);
    try {
      const { error } = await supabase
        .from('auction_bids')
        .insert({
          auction_id: auctionId,
          bidder_id: user.id,
          amount: amount
        });

      if (error) throw error;

      toast({
        title: "Bid Placed!",
        description: `Your bid of $${amount} has been placed successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsPlacingBid(false);
    }
  };

  const currentHighBid = bids[0]?.amount || 0;
  const isUserHighestBidder = bids[0]?.bidder_id === user?.id;

  return {
    bids,
    isLoading,
    isPlacingBid,
    placeBid,
    currentHighBid,
    isUserHighestBidder,
    bidCount: bids.length
  };
};
