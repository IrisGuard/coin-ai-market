import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePlaceBid } from '@/hooks/useBids';
import { useAllDealerCoins } from '@/hooks/useDealerCoins';

export const useCoinDetails = (id: string) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  
  const placeBid = usePlaceBid();
  const { data: allCoins } = useAllDealerCoins();

  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      if (!id) throw new Error('No coin ID provided');
      
      // First try to get from database
      const { data, error } = await supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
            username,
            avatar_url,
            verified_dealer,
            full_name,
            created_at,
            rating,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
      }

      // If found in database, return it
      if (data) {
        return data;
      }

      // Otherwise, look in mock data
      const mockCoin = allCoins?.find(coin => coin.id === id);
      if (mockCoin) {
        return mockCoin;
      }

      throw new Error('Coin not found');
    },
    enabled: !!id,
  });

  // Fix the bids query to handle both real and mock data
  const { data: bidsData } = useQuery({
    queryKey: ['coin-bids', id],
    queryFn: async () => {
      if (!id) return [];
      
      // For mock data, return empty bids array
      if (coin && !coin.created_at?.includes('T')) {
        return [];
      }
      
      // First get bids without trying to join profiles
      const { data: bidsRaw, error: bidsError } = await supabase
        .from('bids')
        .select('*')
        .eq('coin_id', id)
        .order('amount', { ascending: false });

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        return [];
      }

      if (!bidsRaw || bidsRaw.length === 0) return [];

      // Then get profiles for each bid separately
      const bidsWithProfiles = await Promise.all(
        bidsRaw.map(async (bid) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, name, username, avatar_url')
            .eq('id', bid.user_id)
            .single();

          return {
            ...bid,
            profiles: profile || { full_name: '', name: '', username: '', avatar_url: '' }
          };
        })
      );

      return bidsWithProfiles;
    },
    enabled: !!id && !!coin,
  });

  const { data: relatedCoins } = useQuery({
    queryKey: ['related-coins', coin?.rarity, coin?.country],
    queryFn: async () => {
      if (!coin) return [];
      
      // For mock data, find related coins from mock data
      if (allCoins) {
        return allCoins
          .filter(c => 
            c.id !== coin.id && 
            (c.rarity === coin.rarity || c.country === coin.country)
          )
          .slice(0, 4);
      }
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .or(`rarity.eq.${coin.rarity},country.eq.${coin.country}`)
        .neq('id', coin.id)
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!coin,
  });

  const toggleFavorite = async () => {
    if (!user || !coin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('coin_id', coin.id);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            coin_id: coin.id,
          });
      }
      
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorited ? "Coin removed from your favorites" : "Coin added to your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = async () => {
    if (!user || !coin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      // Add purchase logic here
      toast({
        title: "Purchase Initiated",
        description: "Processing your purchase...",
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleBid = async () => {
    if (!user || !coin || !bidAmount) {
      toast({
        title: "Invalid Bid",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      });
      return;
    }

    setIsBidding(true);
    try {
      await placeBid.mutateAsync({ 
        coinId: coin.id, 
        amount: parseFloat(bidAmount) 
      });
      setBidAmount('');
    } catch (error) {
      console.error('Bid error:', error);
    } finally {
      setIsBidding(false);
    }
  };

  return {
    coin,
    isLoading,
    error,
    bidsData,
    relatedCoins,
    isFavorited,
    bidAmount,
    setBidAmount,
    isPurchasing,
    isBidding,
    toggleFavorite,
    handlePurchase,
    handleBid,
    user
  };
};
