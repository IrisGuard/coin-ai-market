
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useErrorLogs = () => {
  return useQuery({
    queryKey: ['error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useMarketplaceStats = () => {
  return useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        // Return default stats if no data exists
        return {
          registered_users: 0,
          listed_coins: 0,
          active_auctions: 0,
          total_volume: 0,
          weekly_transactions: 0
        };
      }
      return data || {
        registered_users: 0,
        listed_coins: 0,
        active_auctions: 0,
        total_volume: 0,
        weekly_transactions: 0
      };
    },
  });
};

export const useScrapingJobs = () => {
  return useQuery({
    queryKey: ['scraping-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select(`
          *,
          data_sources!scraping_jobs_source_id_fkey(
            name
          ),
          vpn_proxies!scraping_jobs_proxy_id_fkey(
            name,
            country_code
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};
