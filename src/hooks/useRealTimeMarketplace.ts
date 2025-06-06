
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Coin } from '@/types/coin';

export const useRealTimeMarketplace = (coins: Coin[]) => {
  const { toast } = useToast();
  const [realTimeUpdates, setRealTimeUpdates] = useState<Record<string, any>>({});

  useEffect(() => {
    // Subscribe to coin updates
    const coinsChannel = supabase
      .channel('marketplace_coins')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'coins' },
        (payload) => {
          const updatedCoin = payload.new;
          setRealTimeUpdates(prev => ({
            ...prev,
            [updatedCoin.id]: updatedCoin
          }));
          
          // Show toast for price changes
          if (payload.old.price !== updatedCoin.price) {
            toast({
              title: "Price Update",
              description: `${updatedCoin.name} price changed to $${updatedCoin.price}`,
            });
          }
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'coins' },
        (payload) => {
          toast({
            title: "New Listing",
            description: `${payload.new.name} has been listed!`,
          });
        }
      )
      .subscribe();

    // Subscribe to auction bid updates
    const bidsChannel = supabase
      .channel('marketplace_bids')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'auction_bids' },
        (payload) => {
          const coinId = payload.new.auction_id;
          const coin = coins.find(c => c.id === coinId);
          if (coin) {
            toast({
              title: "New Bid",
              description: `New bid of $${payload.new.amount} on ${coin.name}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coinsChannel);
      supabase.removeChannel(bidsChannel);
    };
  }, [coins, toast]);

  return realTimeUpdates;
};
