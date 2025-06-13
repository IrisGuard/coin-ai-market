
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
      const [scraping, ai, automation, users, coins, auctions] = await Promise.all([
        supabase.from('scraping_jobs').select('*').eq('status', 'running'),
        supabase.from('ai_commands').select('*').eq('is_active', true),
        supabase.from('automation_rules').select('*').eq('is_active', true),
        supabase.from('profiles').select('*').gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()),
        supabase.from('coins').select('*'),
        supabase.from('coins').select('*').eq('is_auction', true).gt('auction_end', new Date().toISOString())
      ]);

      setStatus({
        scrapingJobs: scraping.data?.length || 0,
        aiCommands: ai.data?.length || 0,
        automationRules: automation.data?.length || 0,
        activeUsers: users.data?.length || 0,
        totalCoins: coins.data?.length || 0,
        liveAuctions: auctions.data?.length || 0,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching system status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return status;
};
