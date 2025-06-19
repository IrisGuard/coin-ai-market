
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';

export interface ListingData {
  coin_id: string;
  listing_type: 'auction' | 'fixed_price' | 'best_offer';
  starting_price: number;
  buyout_price?: number;
  auction_duration?: number;
  description?: string;
  shipping_cost?: number;
  international_shipping?: boolean;
  return_policy?: string;
}

export interface MarketplaceStats {
  total_listings: number;
  active_auctions: number;
  total_value: number;
  average_price: number;
  trending_categories: string[];
}

class MarketplaceService {
  async getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
      const { data: listings } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active');

      const { data: coins } = await supabase
        .from('coins')
        .select('price, category')
        .not('price', 'is', null);

      const total_listings = listings?.length || 0;
      const active_auctions = listings?.filter(l => l.listing_type === 'auction').length || 0;
      const total_value = coins?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;
      const average_price = coins?.length ? total_value / coins.length : 0;

      // Get trending categories
      const categoryCount = coins?.reduce((acc, coin) => {
        acc[coin.category] = (acc[coin.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const trending_categories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category]) => category);

      return {
        total_listings,
        active_auctions,
        total_value,
        average_price,
        trending_categories
      };
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      throw error;
    }
  }

  async createListing(listingData: ListingData) {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert({
          ...listingData,
          seller_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'active',
          current_price: listingData.starting_price
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  async updateListing(listingId: string, updates: Partial<ListingData>) {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .update(updates)
        .eq('id', listingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }

  async deleteListing(listingId: string) {
    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .update({ status: 'cancelled' })
        .eq('id', listingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  async searchListings(query: string, filters?: any) {
    try {
      let queryBuilder = supabase
        .from('marketplace_listings')
        .select(`
          *,
          coins (*)
        `)
        .eq('status', 'active');

      if (query) {
        queryBuilder = queryBuilder.or(`coins.name.ilike.%${query}%,coins.description.ilike.%${query}%`);
      }

      if (filters?.category) {
        queryBuilder = queryBuilder.eq('coins.category', filters.category);
      }

      if (filters?.price_min) {
        queryBuilder = queryBuilder.gte('current_price', filters.price_min);
      }

      if (filters?.price_max) {
        queryBuilder = queryBuilder.lte('current_price', filters.price_max);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching listings:', error);
      throw error;
    }
  }

  async getWishlist(userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          coins (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  async addToWishlist(coinId: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.data.user.id,
          coin_id: coinId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(coinId: string) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.data.user.id)
        .eq('coin_id', coinId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }
}

export const marketplaceService = new MarketplaceService();
