
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeSystemStatus = () => {
  const [status, setStatus] = useState({
    scrapingJobs: 0,
    aiCommands: 0,
    automationRules: 0,
    activeUsers: 0,
    totalCoins: 0,
    liveAuctions: 0,
    lastUpdated: new Date()
  });

  const fetchStatus = async () => {
    try {
      console.log('🔍 Fetching REAL system status...');
      
      const [scraping, ai, automation, users, coins, auctions] = await Promise.all([
        supabase.from('scraping_jobs').select('*'),
        supabase.from('ai_commands').select('*').eq('is_active', true),
        supabase.from('automation_rules').select('*').eq('is_active', true),
        supabase.from('profiles').select('*').gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()),
        supabase.from('coins').select('*'),
        supabase.from('coins').select('*').eq('is_auction', true).gt('auction_end', new Date().toISOString())
      ]);

      const newStatus = {
        scrapingJobs: scraping.data?.length || 0,
        aiCommands: ai.data?.length || 0,
        automationRules: automation.data?.length || 0,
        activeUsers: users.data?.length || 0,
        totalCoins: coins.data?.length || 0,
        liveAuctions: auctions.data?.length || 0,
        lastUpdated: new Date()
      };

      console.log('📊 Real system status:', newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error('❌ Error fetching REAL system status:', error);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchStatus();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(fetchStatus, 5000);
    
    // Set up real-time subscriptions for instant updates
    const scrapingChannel = supabase
      .channel('scraping-jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scraping_jobs' }, fetchStatus)
      .subscribe();

    const aiChannel = supabase
      .channel('ai-commands-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_commands' }, fetchStatus)
      .subscribe();

    const coinsChannel = supabase
      .channel('coins-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coins' }, fetchStatus)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(scrapingChannel);
      supabase.removeChannel(aiChannel);
      supabase.removeChannel(coinsChannel);
    };
  }, []);

  return status;
};
