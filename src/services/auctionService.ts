
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuctionListing } from '@/types/auctionTypes';

export interface BidData {
  listing_id: string;
  amount: number;
  auto_bid_max?: number;
}

class AuctionService {
  async getActiveAuctions(): Promise<AuctionListing[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (*)
        `)
        .eq('listing_type', 'auction')
        .eq('status', 'active')
        .gt('ends_at', new Date().toISOString())
        .order('ends_at', { ascending: true });

      if (error) throw error;
      
      // Transform data to match expected AuctionListing format
      return data?.map(listing => ({
        id: listing.id,
        coin_id: listing.coin_id || '',
        seller_id: listing.seller_id || '',
        listing_type: 'auction' as const,
        starting_price: listing.starting_price || 0,
        current_price: listing.current_price || 0,
        buyout_price: listing.buyout_price || undefined,
        reserve_price: undefined, // Not in current schema
        bid_increment: 1, // Default value
        ends_at: listing.ends_at || '',
        auto_extend: listing.auto_extend || false,
        status: (listing.status as 'active' | 'ended' | 'cancelled' | 'sold') || 'active',
        created_at: listing.created_at || '',
        updated_at: listing.updated_at || '',
        shipping_cost: listing.shipping_cost || undefined,
        international_shipping: listing.international_shipping || false,
        return_policy: listing.return_policy || undefined,
        coins: listing.coins ? {
          id: listing.coins.id,
          name: listing.coins.name || '',
          image: listing.coins.image || '',
          year: listing.coins.year || 0,
          grade: listing.coins.grade || '',
          rarity: listing.coins.rarity || '',
          condition: listing.coins.condition || undefined,
          category: listing.coins.category || '',
          country: listing.coins.country || undefined,
          denomination: listing.coins.denomination || undefined,
          mint: listing.coins.mint || undefined,
          composition: listing.coins.composition || undefined,
          weight: listing.coins.weight || undefined,
          diameter: listing.coins.diameter || undefined,
          mintage: listing.coins.mintage || undefined,
          description: listing.coins.description || undefined,
          images: listing.coins.images || undefined
        } : undefined
      })) || [];
    } catch (error) {
      console.error('Error fetching active auctions:', error);
      throw error;
    }
  }

  async getAuctionById(auctionId: string): Promise<AuctionListing> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (*)
        `)
        .eq('id', auctionId)
        .eq('listing_type', 'auction')
        .single();

      if (error) throw error;
      
      // Transform data to match expected AuctionListing format
      return {
        id: data.id,
        coin_id: data.coin_id || '',
        seller_id: data.seller_id || '',
        listing_type: 'auction' as const,
        starting_price: data.starting_price || 0,
        current_price: data.current_price || 0,
        buyout_price: data.buyout_price || undefined,
        reserve_price: undefined, // Not in current schema
        bid_increment: 1, // Default value
        ends_at: data.ends_at || '',
        auto_extend: data.auto_extend || false,
        status: (data.status as 'active' | 'ended' | 'cancelled' | 'sold') || 'active',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        shipping_cost: data.shipping_cost || undefined,
        international_shipping: data.international_shipping || false,
        return_policy: data.return_policy || undefined,
        coins: data.coins ? {
          id: data.coins.id,
          name: data.coins.name || '',
          image: data.coins.image || '',
          year: data.coins.year || 0,
          grade: data.coins.grade || '',
          rarity: data.coins.rarity || '',
          condition: data.coins.condition || undefined,
          category: data.coins.category || '',
          country: data.coins.country || undefined,
          denomination: data.coins.denomination || undefined,
          mint: data.coins.mint || undefined,
          composition: data.coins.composition || undefined,
          weight: data.coins.weight || undefined,
          diameter: data.coins.diameter || undefined,
          mintage: data.coins.mintage || undefined,
          description: data.coins.description || undefined,
          images: data.coins.images || undefined
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching auction:', error);
      throw error;
    }
  }

  async placeBid(bidData: BidData) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Get current auction details
      const { data: auction, error: auctionError } = await supabase
        .from('marketplace_listings')
        .select('current_price, ends_at, seller_id')
        .eq('id', bidData.listing_id)
        .single();

      if (auctionError) throw auctionError;
      if (!auction) throw new Error('Auction not found');

      // Validate bid amount (using default increment of 1)
      const minimumBid = auction.current_price + 1;
      if (bidData.amount < minimumBid) {
        throw new Error(`Bid must be at least $${minimumBid}`);
      }

      // Check if auction has ended
      if (new Date(auction.ends_at) <= new Date()) {
        throw new Error('Auction has ended');
      }

      // Check if user is not the seller
      if (auction.seller_id === user.data.user.id) {
        throw new Error('Cannot bid on your own auction');
      }

      // Place the bid
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .insert({
          listing_id: bidData.listing_id,
          bidder_id: user.data.user.id,
          user_id: user.data.user.id,
          amount: bidData.amount,
          auto_bid_max: bidData.auto_bid_max,
          coin_id: 'placeholder' // Will be updated with actual coin_id
        })
        .select()
        .single();

      if (bidError) throw bidError;

      // Update auction current price
      const { error: updateError } = await supabase
        .from('marketplace_listings')
        .update({ current_price: bidData.amount })
        .eq('id', bidData.listing_id);

      if (updateError) throw updateError;

      return bid;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }

  async getBidHistory(auctionId: string) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles!bidder_id (name, avatar_url)
        `)
        .eq('listing_id', auctionId)
        .order('amount', { ascending: false });

      if (error) throw error;
      
      // Transform data to include is_auto_bid property
      return data?.map(bid => ({
        ...bid,
        is_auto_bid: bid.auto_bid_max ? true : false
      })) || [];
    } catch (error) {
      console.error('Error fetching bid history:', error);
      throw error;
    }
  }

  async getUserBids(userId: string) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          marketplace_listings!listing_id (
            *,
            coins (*)
          )
        `)
        .eq('bidder_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user bids:', error);
      throw error;
    }
  }

  async addToWatchlist(auctionId: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.data.user.id,
          listing_id: auctionId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  async removeFromWatchlist(auctionId: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('listing_id', auctionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  async getAuctionStats() {
    try {
      const { data: activeAuctions } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('listing_type', 'auction')
        .eq('status', 'active')
        .gt('ends_at', new Date().toISOString());

      const { data: endingSoon } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('listing_type', 'auction')
        .eq('status', 'active')
        .gte('ends_at', new Date().toISOString())
        .lte('ends_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      const { data: totalBids } = await supabase
        .from('bids')
        .select('amount')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      return {
        active_auctions: activeAuctions?.length || 0,
        ending_soon: endingSoon?.length || 0,
        total_bids_24h: totalBids?.length || 0,
        total_value: totalBids?.reduce((sum, bid) => sum + bid.amount, 0) || 0
      };
    } catch (error) {
      console.error('Error fetching auction stats:', error);
      throw error;
    }
  }
}

export const auctionService = new AuctionService();
