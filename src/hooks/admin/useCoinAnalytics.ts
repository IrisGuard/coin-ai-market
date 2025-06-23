import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCoinAnalytics = () => {
  return useQuery({
    queryKey: ['admin-coin-analytics'],
    queryFn: async () => {
      // Get coin statistics
      const [pendingCoins, totalCoins, rejectedCoins] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('authentication_status', 'pending'),
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('authentication_status', 'rejected'),
      ]);

      const [
        { count: featuredCoins },
        { data: coinsByStatus },
        { data: coinsByCategory },
        { data: coinsByMonth }
      ] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('coins')
          .select('authentication_status')
          .then(res => res.data?.reduce((acc: any, coin) => {
            acc[coin.authentication_status] = (acc[coin.authentication_status] || 0) + 1;
            return acc;
          }, {}) || {}),
        supabase.from('coins')
          .select('category')
          .then(res => res.data?.reduce((acc: any, coin) => {
            acc[coin.category || 'unclassified'] = (acc[coin.category || 'unclassified'] || 0) + 1;
            return acc;
          }, {}) || {}),
        supabase.from('coins')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
          .then(res => res.data?.reduce((acc: any, coin) => {
            const month = new Date(coin.created_at).toISOString().slice(0, 7);
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {}) || {})
      ]);

      return {
        totals: {
          total: totalCoins || 0,
          pending: pendingCoins || 0,
          rejected: rejectedCoins || 0,
          featured: featuredCoins || 0
        },
        distributions: {
          byStatus: coinsByStatus,
          byCategory: coinsByCategory,
          byMonth: coinsByMonth
        }
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
