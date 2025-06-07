
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockAuctionCoins } from '@/data/mockAuctionCoins';
import { AuctionCoin } from '@/types/auction';

export const useAuctionFetch = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionCoin[]>([]);

  useEffect(() => {
    const fetchAuctionsData = async () => {
      setIsLoading(true);
      try {
        // Try to get from database first
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
            profiles!user_id (
              name,
              reputation,
              verified_dealer
            )
          `)
          .eq('is_auction', true)
          .gt('auction_end', new Date().toISOString())
          .order('auction_end', { ascending: true });

        let auctionsWithBids;

        // If database has auction data, use it
        if (auctionsData && auctionsData.length > 0) {
          auctionsWithBids = await Promise.all(
            auctionsData.map(async (auction: any) => {
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
                views: auction.views || 0,
                grade: auction.grade || 'N/A'
              };
            })
          );
        } else {
          // Use mock data if no database data
          console.log('Using mock auction data');
          auctionsWithBids = mockAuctionCoins.filter(auction => {
            const auctionEnd = new Date(auction.auction_end);
            return auctionEnd > new Date(); // Only show active auctions
          });
        }

        setAuctions(auctionsWithBids);

      } catch (error) {
        console.error('Error fetching auctions:', error);
        // Fallback to mock data on error
        const activeAuctions = mockAuctionCoins.filter(auction => {
          const auctionEnd = new Date(auction.auction_end);
          return auctionEnd > new Date();
        });
        setAuctions(activeAuctions);
        
        toast({
          title: "Using Demo Data",
          description: "Showing demo auctions while connecting to database",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctionsData();
  }, [toast]);

  return { auctions, isLoading };
};
