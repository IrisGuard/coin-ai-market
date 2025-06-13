
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMarketplaceStats } from '../useMarketplaceStats';

export const useRealTimeStats = () => {
  const { data: stats, refetch } = useMarketplaceStats();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup any existing subscription first
    if (channelRef.current) {
      console.log('🛑 Cleaning up existing real-time stats subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🔄 Setting up real-time stats subscription...');

    const handleUpdate = () => {
      refetch();
      setLastUpdate(new Date());
    };

    // Create single channel with unique name
    const timestamp = Date.now();
    const channel = supabase
      .channel(`stats-changes-${timestamp}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coins' }, handleUpdate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, handleUpdate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, handleUpdate)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time stats subscription established');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time stats subscription error');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🛑 Cleaning up real-time stats subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [refetch]);

  return {
    stats,
    lastUpdate,
    isRealTime: !!channelRef.current
  };
};
