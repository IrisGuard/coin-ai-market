import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCoinDetails = (id: string) => {
  const [bidAmount, setBidAmount] = useState('');
  const queryClient = useQueryClient();

  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            name,
            username,
            verified_dealer
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: bidsData } = useQuery({
    queryKey: ['coin-bids', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          created_at,
          user_id
        `)
        .eq('coin_id', id)
        .order('amount', { ascending: false });
      
      if (error) throw error;
      
      // Get profiles separately to avoid foreign key issues
      const bidsWithProfiles = await Promise.all(
        (data || []).map(async (bid) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, username')
            .eq('id', bid.user_id)
            .single();
          
          return {
            ...bid,
            profiles: profile || { name: '', username: '' }
          };
        })
      );
      
      return bidsWithProfiles;
    },
    enabled: !!id
  });

  const { data: relatedCoins } = useQuery({
    queryKey: ['related-coins', coin?.category],
    queryFn: async () => {
      if (!coin?.category) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('id, name, price, image, grade, year')
        .eq('category', coin.category)
        .neq('id', id)
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!coin?.category
  });

  const { data: isFavorited } = useQuery({
    queryKey: ['is-favorited', id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('coin_id', id)
        .eq('user_id', user.user.id)
        .single();
      
      return !!data;
    },
    enabled: !!id
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Must be logged in');

      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('coin_id', id)
          .eq('user_id', user.user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            coin_id: id,
            user_id: user.user.id
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-favorited', id] });
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    },
    onError: (error) => {
      toast.error(`Failed to update favorites: ${error.message}`);
    }
  });

  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('bids')
        .insert({
          coin_id: id,
          user_id: user.user.id,
          amount
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coin-bids', id] });
      setBidAmount('');
      toast.success('Bid placed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to place bid: ${error.message}`);
    }
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.user.id,
          coin_id: id,
          amount: coin?.price || 0,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Purchase initiated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to initiate purchase: ${error.message}`);
    }
  });

  return {
    coin,
    isLoading,
    error,
    bidsData: bidsData || [],
    relatedCoins: relatedCoins || [],
    isFavorited: isFavorited || false,
    bidAmount,
    setBidAmount,
    isPurchasing: purchaseMutation.isPending,
    isBidding: bidMutation.isPending,
    toggleFavorite: toggleFavoriteMutation.mutate,
    handlePurchase: purchaseMutation.mutate,
    handleBid: () => {
      const amount = parseFloat(bidAmount);
      if (amount > 0) {
        bidMutation.mutate(amount);
      }
    }
  };
};
