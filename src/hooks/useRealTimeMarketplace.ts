
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';

interface RealTimeUpdate {
  id: string;
  price?: number;
  views?: number;
  favorites?: number;
  sold?: boolean;
}

export const useRealTimeMarketplace = (coins: Coin[]) => {
  const [updates, setUpdates] = useState<Record<string, RealTimeUpdate>>({});

  useEffect(() => {
    if (!coins.length) return;

    // Set up real-time subscription for coin updates
    const channel = supabase
      .channel('marketplace-updates')
      .on('postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'coins' 
        },
        (payload) => {
          const coinUpdate = payload.new as any;
          setUpdates(prev => ({
            ...prev,
            [coinUpdate.id]: {
              id: coinUpdate.id,
              price: coinUpdate.price,
              views: coinUpdate.views,
              favorites: coinUpdate.favorites,
              sold: coinUpdate.sold
            }
          }));
        }
      )
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'bids' 
        },
        (payload) => {
          const bid = payload.new as any;
          // Update the coin's current bid price in real-time
          setUpdates(prev => ({
            ...prev,
            [bid.coin_id]: {
              ...prev[bid.coin_id],
              id: bid.coin_id,
              price: bid.amount
            }
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coins]);

  return updates;
};
