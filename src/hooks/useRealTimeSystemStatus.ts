
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  activeUsers: number;
  totalCoins: number;
  scrapingJobs: number;
  aiCommands: number;
  liveAuctions: number;
  automationRules: number;
  lastUpdated: Date;
}

export const useRealTimeSystemStatus = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Query real data from Supabase
  const { data: systemData, refetch } = useQuery({
    queryKey: ['real-time-system-status'],
    queryFn: async () => {
      console.log('🔄 Fetching real system status...');
      
      // Get real data from multiple tables
      const [
        usersResult,
        coinsResult,
        aiCommandsResult,
        automationRulesResult,
        dataSourcesResult,
        auctionsResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('ai_commands').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('automation_rules').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('data_sources').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('is_auction', true).gt('auction_end', new Date().toISOString())
      ]);

      const realStats = {
        activeUsers: usersResult.count || 0,
        totalCoins: coinsResult.count || 0,
        scrapingJobs: dataSourcesResult.count || 0,
        aiCommands: aiCommandsResult.count || 0,
        liveAuctions: auctionsResult.count || 0,
        automationRules: automationRulesResult.count || 0
      };

      console.log('✅ Real system stats:', realStats);
      return realStats;
    },
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Update timestamp whenever data refreshes
  useEffect(() => {
    if (systemData) {
      setLastUpdated(new Date());
    }
  }, [systemData]);

  // Set up real-time subscriptions for live updates
  useEffect(() => {
    console.log('🔄 Setting up real-time subscriptions...');
    
    const channel = supabase
      .channel('system-status-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        console.log('👤 Profiles updated, refreshing...');
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coins' }, () => {
        console.log('🪙 Coins updated, refreshing...');
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_commands' }, () => {
        console.log('🧠 AI Commands updated, refreshing...');
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automation_rules' }, () => {
        console.log('⚙️ Automation Rules updated, refreshing...');
        refetch();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'data_sources' }, () => {
        console.log('📊 Data Sources updated, refreshing...');
        refetch();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscriptions established');
        }
      });

    return () => {
      console.log('🛑 Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Return real status data
  const status: SystemStatus = {
    activeUsers: systemData?.activeUsers || 0,
    totalCoins: systemData?.totalCoins || 0,
    scrapingJobs: systemData?.scrapingJobs || 0,
    aiCommands: systemData?.aiCommands || 0,
    liveAuctions: systemData?.liveAuctions || 0,
    automationRules: systemData?.automationRules || 0,
    lastUpdated
  };

  console.log('📊 Returning real system status:', status);
  return status;
};
