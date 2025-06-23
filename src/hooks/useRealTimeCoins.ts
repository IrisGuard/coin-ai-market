import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RealTimeCoin {
  id: string;
  name: string;
  price: number;
  image: string;
  grade: string;
  year: number;
  category: string;
  rarity: string;
  created_at: string;
  updated_at: string;
  views: number;
  featured: boolean;
  is_auction: boolean;
  auction_end?: string;
  authentication_status: string;
}

export const useRealTimeCoins = (filters?: {
  category?: string;
  priceRange?: { min: number; max: number };
  rarity?: string;
  featured?: boolean;
  auctions?: boolean;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [newCoinAlert, setNewCoinAlert] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const { data: coins, isLoading, refetch } = useQuery({
    queryKey: ['real-time-coins', filters],
    queryFn: async (): Promise<RealTimeCoin[]> => {
      let query = supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            username,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters with proper type casting
      if (filters?.category) {
        query = query.eq('category', filters.category as any);
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange.min)
          .lte('price', filters.priceRange.max);
      }

      if (filters?.rarity) {
        query = query.eq('rarity', filters.rarity);
      }

      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      if (filters?.auctions) {
        query = query
          .eq('is_auction', true)
          .gt('auction_end', new Date().toISOString());
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data as RealTimeCoin[] || [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Set up real-time subscription for new coins
  useEffect(() => {
    // Cleanup any existing subscription first
    if (channelRef.current) {
      console.log('🛑 Cleaning up existing coins subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }

    console.log('🔄 Setting up real-time coins subscription...');
    
    const channelName = `coins-changes-realtime-${Date.now()}`;
    
    const channel = supabase
      .channel('coins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coins'
        },
        handleCoinChange
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      console.log('🛑 Cleaning up real-time coins subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsConnected(false);
      }
    };
  }, [refetch]);

  // Analytics tracking for coin views
  const trackCoinView = async (coinId: string) => {
    try {
      // Increment view count
      await supabase
        .from('coins')
        .update({ views: (coins?.find(c => c.id === coinId)?.views || 0) + 1 })
        .eq('id', coinId);

      // Log analytics event
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'coin_view',
          page_url: `/coins/${coinId}`,
          metadata: { coin_id: coinId }
        });
    } catch (error) {
      console.error('Error tracking coin view:', error);
    }
  };

  return {
    coins: coins || [],
    isLoading,
    isConnected,
    newCoinAlert,
    trackCoinView,
    refetch
  };
};
