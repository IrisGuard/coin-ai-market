
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMarketplaceStats } from '../useMarketplaceStats';

export const useRealTimeStats = () => {
  const { data: stats, refetch } = useMarketplaceStats();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Set up real-time subscriptions for live updates
    const coinsSubscription = supabase
      .channel('coins-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'coins' },
        () => {
          refetch();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          refetch();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    const transactionsSubscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          refetch();
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coinsSubscription);
      supabase.removeChannel(profilesSubscription);
      supabase.removeChannel(transactionsSubscription);
    };
  }, [refetch]);

  return {
    stats,
    lastUpdate,
    isRealTime: true
  };
};
