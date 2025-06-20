
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProductionCoins = () => {
  return useQuery({
    queryKey: ['production-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Production data fetch error:', error);
        throw error;
      }

      return data || [];
    },
    refetchInterval: 30000
  });
};

export const useProductionUsers = () => {
  return useQuery({
    queryKey: ['production-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Production users fetch error:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useProductionAnalytics = () => {
  return useQuery({
    queryKey: ['production-analytics'],
    queryFn: async () => {
      const [coinsCount, usersCount, transactionsCount] = await Promise.all([
        supabase.from('coins').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('analytics_events').select('id', { count: 'exact' })
      ]);

      return {
        totalCoins: coinsCount.count || 0,
        totalUsers: usersCount.count || 0,
        totalEvents: transactionsCount.count || 0,
        lastUpdated: new Date().toISOString(),
        source: 'production_database'
      };
    },
    refetchInterval: 60000
  });
};
