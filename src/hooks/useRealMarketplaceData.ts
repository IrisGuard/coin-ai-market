
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MarketplaceListing {
  id: string;
  coin_id: string;
  seller_id: string;
  listing_type: 'sale' | 'auction';
  starting_price: number;
  current_price: number;
  buyout_price?: number;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  ends_at?: string;
  created_at: string;
  coins: {
    id: string;
    name: string;
    year: number;
    grade: string;
    rarity: string;
    image: string;
    country?: string;
    denomination?: string;
    condition?: string;
    profiles: {
      id: string;
      name: string;
      reputation: number;
      verified_dealer: boolean;
      avatar_url?: string;
    };
  };
  profiles: {
    id: string;
    name: string;
    reputation: number;
    verified_dealer: boolean;
  };
  bids: Array<{
    id: string;
    amount: number;
    bidder_id: string;
    created_at: string;
    profiles: {
      name: string;
    };
  }>;
}

export const useMarketplaceListings = () => {
  return useQuery({
    queryKey: ['marketplace-listings'],
    queryFn: async (): Promise<MarketplaceListing[]> => {
      // Using any type temporarily until database types are regenerated
      const { data, error } = await supabase
        .from('marketplace_listings' as any)
        .select(`
          *,
          coins!inner(
            *,
            profiles!coins_user_id_fkey(
              id,
              name,
              reputation,
              verified_dealer,
              avatar_url
            )
          ),
          profiles!marketplace_listings_seller_id_fkey(
            id,
            name,
            reputation,
            verified_dealer
          ),
          bids(
            id,
            amount,
            bidder_id,
            created_at,
            profiles!bids_bidder_id_fkey(name)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching marketplace listings:', error);
        throw error;
      }

      return (data || []) as MarketplaceListing[];
    },
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      coinId, 
      listingType, 
      startingPrice, 
      buyoutPrice, 
      duration 
    }: {
      coinId: string;
      listingType: 'sale' | 'auction';
      startingPrice: number;
      buyoutPrice?: number;
      duration?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to create listing');

      const endsAt = listingType === 'auction' && duration
        ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Using any type temporarily until database types are regenerated
      const { data, error } = await supabase
        .from('marketplace_listings' as any)
        .insert({
          coin_id: coinId,
          seller_id: user.id,
          listing_type: listingType,
          starting_price: startingPrice,
          current_price: listingType === 'auction' ? startingPrice : null,
          buyout_price: buyoutPrice,
          ends_at: endsAt
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: "Listing Created",
        description: "Your coin has been listed on the marketplace!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Listing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
