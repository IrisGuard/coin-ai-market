
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMarketplaceStats = () => {
  return useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      const [usersResult, coinsResult, transactionsResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*', { count: 'exact', head: true })
      ]);

      return {
        registered_users: usersResult.count || 0,
        listed_coins: coinsResult.count || 0,
        total_transactions: transactionsResult.count || 0
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
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAdminData = () => {
  return useQuery({
    queryKey: ['admin-data'],
    queryFn: async () => {
      const [statsResult, healthResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true })
      ]);

      return {
        stats: {
          totalUsers: statsResult.count || 0,
          totalCoins: healthResult.count || 0,
          totalTransactions: 0,
          totalErrors: 0,
          averageAccuracy: 94
        },
        systemHealth: {
          status: 'healthy',
          uptime: '99.9%',
          serverStatus: 'online'
        }
      };
    },
  });
};
