
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
        .select('*')
        .eq('authentication_status', 'verified')
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
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'coins',
        filter: 'authentication_status=eq.verified'
      }, (payload) => {
        // Show alert for new coin
        const newCoin = payload.new as RealTimeCoin;
        setNewCoinAlert(`New coin added: ${newCoin.name}`);
        setTimeout(() => setNewCoinAlert(null), 5000);
        
        // Refetch data
        refetch();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'coins'
      }, () => {
        refetch();
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'coins'
      }, () => {
        refetch();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log('✅ Real-time coins subscription established');
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          console.error('❌ Real-time coins subscription error');
        }
      });

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
