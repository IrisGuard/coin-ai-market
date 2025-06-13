
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMarketplaceStats } from '../useMarketplaceStats';

export const useRealTimeStats = () => {
  const { data: stats, refetch } = useMarketplaceStats();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const channelsRef = useRef<any[]>([]);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple subscriptions
    if (isSubscribedRef.current || channelsRef.current.length > 0) {
      return;
    }

    console.log('🔄 Setting up real-time stats subscriptions...');

    const handleUpdate = () => {
      refetch();
      setLastUpdate(new Date());
    };

    // Create unique channel names
    const timestamp = Date.now();
    
    const coinsSubscription = supabase
      .channel(`coins-changes-stats-${timestamp}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'coins' },
        handleUpdate
      )
      .subscribe();

    const profilesSubscription = supabase
      .channel(`profiles-changes-stats-${timestamp}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        handleUpdate
      )
      .subscribe();

    const transactionsSubscription = supabase
      .channel(`transactions-changes-stats-${timestamp}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        handleUpdate
      )
      .subscribe();

    channelsRef.current = [coinsSubscription, profilesSubscription, transactionsSubscription];
    isSubscribedRef.current = true;

    return () => {
      console.log('🛑 Cleaning up real-time stats subscriptions');
      channelsRef.current.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
      channelsRef.current = [];
      isSubscribedRef.current = false;
    };
  }, [refetch]);

  return {
    stats,
    lastUpdate,
    isRealTime: isSubscribedRef.current
  };
};
