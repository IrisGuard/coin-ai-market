import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarketplaceData {
  totalListings: number;
  activeAuctions: number;
  avgPrice: number;
  newListings24h: number;
  endingSoon: number;
  topCategories: Array<{ name: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: 'listing' | 'bid' | 'sale';
    coinName: string;
    amount: number;
    timestamp: string;
  }>;
}

export const useRealTimeMarketplace = () => {
  const [isConnected, setIsConnected] = useState(false);

  const { data: marketplaceData, isLoading, error, refetch } = useQuery({
    queryKey: ['real-time-marketplace'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: auctionData } = useQuery({
    queryKey: ['real-time-auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('is_auction', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const { data: trendingData } = useQuery({
    queryKey: ['real-time-trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('marketplace-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coins'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_transactions'
        },
        () => {
          refetch();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    data: marketplaceData || {
      totalListings: 0,
      activeAuctions: 0,
      avgPrice: 0,
      newListings24h: 0,
      endingSoon: 0,
      topCategories: [],
      recentActivity: []
    },
    isLoading,
    isConnected,
    refetch
  };
};
