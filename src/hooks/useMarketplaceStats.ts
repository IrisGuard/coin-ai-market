
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMarketplaceStats = () => {
  return useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      // Get counts from all relevant tables
      const [
        { count: totalCoins },
        { count: activeAuctions },
        { count: featuredCoins },
        { count: activeUsers },
        { count: totalTransactions },
        { data: coinPrices }
      ] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('is_auction', true),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('price')
      ]);

      // Calculate total value
      const totalValue = coinPrices?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;

      return {
        total: totalCoins || 0,
        auctions: activeAuctions || 0,
        featured: featuredCoins || 0,
        activeUsers: activeUsers || 0,
        totalTransactions: totalTransactions || 0,
        totalValue,
        loading: false
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });
};
