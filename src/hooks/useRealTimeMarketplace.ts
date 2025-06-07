
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';

interface RealTimeUpdate {
  views?: number;
  price?: number;
  auction_end?: string;
  current_bid?: number;
  bid_count?: number;
}

interface BidPayload {
  new?: {
    coin_id: string;
    amount: number;
    [key: string]: any;
  };
  old?: {
    coin_id: string;
    [key: string]: any;
  };
}

export const useRealTimeMarketplace = (coins: Coin[]) => {
  const [realTimeUpdates, setRealTimeUpdates] = useState<Record<string, RealTimeUpdate>>({});

  useEffect(() => {
    if (!coins.length) return;

    // Subscribe to coin updates
    const coinChannel = supabase
      .channel('coin-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coins'
        },
        (payload) => {
          const { new: newCoin } = payload;
          if (newCoin && typeof newCoin === 'object' && 'id' in newCoin) {
            setRealTimeUpdates(prev => ({
              ...prev,
              [newCoin.id]: {
                views: newCoin.views,
                price: newCoin.price,
                auction_end: newCoin.auction_end
              }
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to bid updates
    const bidChannel = supabase
      .channel('bid-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bids'
        },
        async (payload: { new?: any; old?: any }) => {
          const bidPayload = payload as BidPayload;
          const coinId = bidPayload.new?.coin_id || bidPayload.old?.coin_id;
          
          if (coinId) {
            // Fetch updated bid count and highest bid
            const { data: bids } = await supabase
              .from('bids')
              .select('amount')
              .eq('coin_id', coinId)
              .order('amount', { ascending: false });

            if (bids) {
              setRealTimeUpdates(prev => ({
                ...prev,
                [coinId]: {
                  ...prev[coinId],
                  current_bid: bids[0]?.amount || 0,
                  bid_count: bids.length
                }
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coinChannel);
      supabase.removeChannel(bidChannel);
    };
  }, [coins]);

  return realTimeUpdates;
};
