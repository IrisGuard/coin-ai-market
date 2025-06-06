
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuctionCoin {
  id: string;
  name: string;
  year: number;
  image: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  auction_end: string;
  bid_count: number;
  rarity: string;
  condition: string;
  country: string;
  seller_id: string;
  highest_bidder_id: string | null;
  description: string;
  views: number;
  watchers: number;
  profiles?: {
    name: string;
    reputation: number;
    verified_dealer: boolean;
  };
}

interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    name: string;
  };
}

export const useAuctionData = (userId?: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionCoin[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);

  useEffect(() => {
    const fetchAuctionsData = async () => {
      setIsLoading(true);
      try {
        // Fetch active auctions
        const { data: auctionsData, error: auctionsError } = await supabase
          .from('coins')
          .select(`
            id,
            name,
            year,
            image,
            price,
            reserve_price,
            auction_end,
            rarity,
            condition,
            country,
            user_id,
            description,
            views,
            profiles!coins_user_id_fkey(
              name,
              reputation,
              verified_dealer
            )
          `)
          .eq('is_auction', true)
          .gt('auction_end', new Date().toISOString())
          .order('auction_end', { ascending: true });

        if (auctionsError) throw auctionsError;

        // Filter out auctions without valid profile data
        const validAuctions = (auctionsData || []).filter(auction => 
          auction.profiles && 
          typeof auction.profiles === 'object' && 
          'name' in auction.profiles
        );

        // Fetch bid counts and current bids for each auction
        const auctionsWithBids = await Promise.all(
          validAuctions.map(async (auction) => {
            const { data: bids } = await supabase
              .from('auction_bids')
              .select('amount, bidder_id')
              .eq('auction_id', auction.id)
              .order('amount', { ascending: false });

            const { count: bidCount } = await supabase
              .from('auction_bids')
              .select('*', { count: 'exact', head: true })
              .eq('auction_id', auction.id);

            const { count: watcherCount } = await supabase
              .from('watchlist')
              .select('*', { count: 'exact', head: true })
              .eq('listing_id', auction.id);

            const currentBid = bids?.[0]?.amount || auction.price;
            const highestBidderId = bids?.[0]?.bidder_id || null;

            return {
              ...auction,
              starting_price: auction.price,
              current_bid: currentBid,
              bid_count: bidCount || 0,
              highest_bidder_id: highestBidderId,
              seller_id: auction.user_id,
              watchers: watcherCount || 0,
              profiles: auction.profiles as { name: string; reputation: number; verified_dealer: boolean; }
            };
          })
        );

        setAuctions(auctionsWithBids);

        // Fetch user's bids if authenticated
        if (userId) {
          const { data: userBids, error: bidsError } = await supabase
            .from('auction_bids')
            .select(`
              *,
              profiles!auction_bids_bidder_id_fkey(name)
            `)
            .eq('bidder_id', userId)
            .order('created_at', { ascending: false });

          if (bidsError) {
            console.error('Error fetching user bids:', bidsError);
            setMyBids([]);
          } else {
            // Filter out any invalid bids and ensure proper typing
            const validBids = (userBids || []).filter(bid => 
              bid && bid.profiles && typeof bid.profiles === 'object' && 'name' in bid.profiles
            ).map(bid => ({
              ...bid,
              profiles: bid.profiles as { name: string; }
            })) as Bid[];
            setMyBids(validBids);
          }
        }

      } catch (error) {
        console.error('Error fetching auctions:', error);
        toast({
          title: "Error",
          description: "Failed to load auctions data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctionsData();
    
    // Set up real-time subscription for auction updates
    const channel = supabase
      .channel('auction_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'auction_bids' },
        (payload) => {
          // Update auction with new bid
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
  }, [userId, toast]);

  return { auctions, myBids, isLoading };
};
