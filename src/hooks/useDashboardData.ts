
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardData = () => {
  const { user } = useAuth();

  const { data: stats = {
    totalValue: 0,
    totalCoins: 0,
    profitLoss: 0,
    profitPercentage: 0,
    portfolioItems: []
  }, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: coins, error } = await supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalValue = coins?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;
      const totalCoins = coins?.length || 0;

      return {
        totalValue,
        totalCoins,
        profitLoss: totalValue * 0.12, // Mock 12% profit
        profitPercentage: 12.5,
        portfolioItems: coins || []
      };
    },
    enabled: !!user,
  });

  const { data: watchlistItems = [], isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          *,
          listing_id (
            id,
            current_price,
            coin_id (
              name,
              image,
              year
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: recentTransactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['recent-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          coin_id (
            name,
            image,
            year
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          coin_id (
            id,
            name,
            image,
            year,
            price
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  return {
    stats,
    watchlistItems,
    recentTransactions,
    favorites,
    isLoading: statsLoading || watchlistLoading || transactionsLoading || favoritesLoading
  };
};
