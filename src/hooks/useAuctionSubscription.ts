
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuctionCoin } from '@/types/auctionData';

export const useAuctionSubscription = (
  setAuctions: React.Dispatch<React.SetStateAction<AuctionCoin[]>>
) => {
  useEffect(() => {
    // Set up real-time subscription for auction updates
    const channel = supabase
      .channel('auction_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'auction_bids' },
        (payload) => {
          setAuctions(prev => prev.map(auction => {
            if (auction.id === payload.new.auction_id) {
              return {
                ...auction,
                current_bid: payload.new.amount,
                bid_count: auction.bid_count + 1,
                highest_bidder_id: payload.new.bidder_id
              };
            }
            return auction;
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setAuctions]);
};
