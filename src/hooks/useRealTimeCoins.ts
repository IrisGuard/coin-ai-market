
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';

export const useRealTimeCoins = (initialCoins: Coin[] = []) => {
  const [coins, setCoins] = useState<Coin[]>(initialCoins);

  useEffect(() => {
    setCoins(initialCoins);
  }, [initialCoins]);

  useEffect(() => {
    const channel = supabase
      .channel('coins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coins'
        },
        (payload) => {
          console.log('Real-time coin update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newCoin = payload.new as Coin;
            setCoins(prev => [newCoin, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedCoin = payload.new as Coin;
            setCoins(prev => prev.map(coin => 
              coin.id === updatedCoin.id ? updatedCoin : coin
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setCoins(prev => prev.filter(coin => coin.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return coins;
};

// Create a simplified hook that doesn't require initial coins
export const useRealTimeCoinsSimple = () => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    // Fetch initial coins
    const fetchInitialCoins = async () => {
      const { data } = await supabase
        .from('coins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data) {
        setCoins(data);
      }
    };

    fetchInitialCoins();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('coins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coins'
        },
        (payload) => {
          console.log('Real-time coin update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newCoin = payload.new as Coin;
            setCoins(prev => [newCoin, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedCoin = payload.new as Coin;
            setCoins(prev => prev.map(coin => 
              coin.id === updatedCoin.id ? updatedCoin : coin
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setCoins(prev => prev.filter(coin => coin.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return coins;
};
