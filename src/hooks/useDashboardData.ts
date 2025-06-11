
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      return data || {
        totalCoins: 0,
        totalValue: 0,
        watchlistItems: 0,
        recentActivity: 0
      };
    }
  });

  const { data: watchlistItems, isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          coins (
            id,
            name,
            price,
            image,
            category
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: recentTransactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          id,
          amount,
          status,
          created_at,
          coins (
            name,
            image
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          coins (
            id,
            name,
            price,
            image,
            grade,
            year
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(fav => fav.coins).filter(Boolean) || [];
    }
  });

  return {
    stats: stats || { totalCoins: 0, totalValue: 0, watchlistItems: 0, recentActivity: 0 },
    watchlistItems: watchlistItems || [],
    recentTransactions: recentTransactions || [],
    favorites: favorites || [],
    isLoading: statsLoading || watchlistLoading || transactionsLoading || favoritesLoading
  };
};
