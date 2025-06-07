
import { supabase } from '@/integrations/supabase/client';
import { mockAuctionCoins } from '@/data/mockAuctionCoins';
import { AuctionCoin } from '@/types/auctionData';

export const useAuctionsFetch = () => {
  const fetchAuctions = async (): Promise<AuctionCoin[]> => {
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

      // If database has auction data, use it
      if (auctionsData && auctionsData.length > 0) {
        const auctionsWithBids = await Promise.all(
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
              views: auction.views || 0
            };
          })
        );
        return auctionsWithBids;
      } else {
        // Use mock data if no database data
        console.log('Using mock auction data');
        return mockAuctionCoins.filter(auction => {
          const auctionEnd = new Date(auction.auction_end);
          return auctionEnd > new Date(); // Only show active auctions
        });
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      // Fallback to mock data on error
      return mockAuctionCoins.filter(auction => {
        const auctionEnd = new Date(auction.auction_end);
        return auctionEnd > new Date();
      });
    }
  };

  return { fetchAuctions };
};
