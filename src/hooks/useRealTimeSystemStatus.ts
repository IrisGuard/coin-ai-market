
import { useState, useEffect, useRef } from 'react';
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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelsRef = useRef<any[]>([]);
  const isSubscribedRef = useRef(false);

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
    // Prevent multiple subscriptions
    if (isSubscribedRef.current || channelsRef.current.length > 0) {
      return;
    }

    // Fetch immediately
    fetchStatus();
    
    // Set up polling interval
    intervalRef.current = setInterval(fetchStatus, 5000);
    
    // Set up real-time subscriptions with unique channel names
    const timestamp = Date.now();
    
    const scrapingChannel = supabase
      .channel(`scraping-jobs-changes-${timestamp}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scraping_jobs' }, fetchStatus)
      .subscribe();

    const aiChannel = supabase
      .channel(`ai-commands-changes-${timestamp}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_commands' }, fetchStatus)
      .subscribe();

    const coinsChannel = supabase
      .channel(`coins-changes-${timestamp}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coins' }, fetchStatus)
      .subscribe();

    channelsRef.current = [scrapingChannel, aiChannel, coinsChannel];
    isSubscribedRef.current = true;

    return () => {
      console.log('🛑 Cleaning up system status subscriptions');
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      channelsRef.current.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
      channelsRef.current = [];
      isSubscribedRef.current = false;
    };
  }, []);

  return status;
};
