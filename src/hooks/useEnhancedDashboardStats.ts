
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDashboardStats {
  totalCoins: number;
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
  favoriteCoins: number;
  watchlistItems: number;
  activeAuctions: number;
  completedTransactions: number;
  portfolioItems: any[];
}

interface RecentActivity {
  id: string;
  type: 'purchase' | 'sale' | 'bid' | 'favorite' | 'watchlist';
  coin_name: string;
  coin_image?: string;
  amount?: number;
  price?: number;
  created_at: string;
}

export const useEnhancedDashboardStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<EnhancedDashboardStats>({
    totalCoins: 0,
    totalValue: 0,
    totalProfit: 0,
    profitPercentage: 0,
    favoriteCoins: 0,
    watchlistItems: 0,
    activeAuctions: 0,
    completedTransactions: 0,
    portfolioItems: []
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchEnhancedStats();
    }
  }, [user?.id]);

  const fetchEnhancedStats = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPortfolioStats(),
        fetchActivityStats(),
        fetchRecentActivity()
      ]);
    } catch (error) {
      console.error('Error fetching enhanced dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioStats = async () => {
    if (!user?.id) return;

    // Get portfolio with coin data
    const { data: portfolioItems } = await supabase
      .from('user_portfolios')
      .select(`
        *,
        coins!user_portfolios_coin_id_fkey(
          id, name, price, image, created_at
        )
      `)
      .eq('user_id', user.id);

    // Calculate portfolio statistics
    const totalCoins = portfolioItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalValue = portfolioItems?.reduce((sum, item) => 
      sum + (item.coins?.price || item.purchase_price || 0) * item.quantity, 0) || 0;
    const totalCost = portfolioItems?.reduce((sum, item) => 
      sum + (item.purchase_price || 0) * item.quantity, 0) || 0;
    const totalProfit = totalValue - totalCost;
    const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    // Get favorites count
    const { count: favoritesCount } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get watchlist count
    const { count: watchlistCount } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setStats(prev => ({
      ...prev,
      totalCoins,
      totalValue,
      totalProfit,
      profitPercentage,
      favoriteCoins: favoritesCount || 0,
      watchlistItems: watchlistCount || 0,
      portfolioItems: portfolioItems || []
    }));
  };

  const fetchActivityStats = async () => {
    if (!user?.id) return;

    // Get active auctions count
    const { count: auctionsCount } = await supabase
      .from('coins')
      .select('*', { count: 'exact', head: true })
      .eq('is_auction', true)
      .gt('auction_end', new Date().toISOString());

    // Get completed transactions count
    const { count: transactionsCount } = await supabase
      .from('payment_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    setStats(prev => ({
      ...prev,
      activeAuctions: auctionsCount || 0,
      completedTransactions: transactionsCount || 0
    }));
  };

  const fetchRecentActivity = async () => {
    if (!user?.id) return;

    const activities: RecentActivity[] = [];

    // Get recent bids
    const { data: recentBids } = await supabase
      .from('bids')
      .select(`
        id, amount, created_at,
        coins!bids_coin_id_fkey(name, image)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentBids) {
      activities.push(...recentBids.map(bid => ({
        id: bid.id,
        type: 'bid' as const,
        coin_name: bid.coins?.name || 'Unknown Coin',
        coin_image: bid.coins?.image,
        amount: bid.amount,
        created_at: bid.created_at || ''
      })));
    }

    // Get recent favorites
    const { data: recentFavorites } = await supabase
      .from('user_favorites')
      .select(`
        id, created_at,
        coins!user_favorites_coin_id_fkey(name, image)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentFavorites) {
      activities.push(...recentFavorites.map(fav => ({
        id: fav.id,
        type: 'favorite' as const,
        coin_name: fav.coins?.name || 'Unknown Coin',
        coin_image: fav.coins?.image,
        created_at: fav.created_at || ''
      })));
    }

    // Get recent transactions
    const { data: recentTransactions } = await supabase
      .from('payment_transactions')
      .select(`
        id, amount, created_at,
        coins!payment_transactions_coin_id_fkey(name, image)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentTransactions) {
      activities.push(...recentTransactions.map(trans => ({
        id: trans.id,
        type: 'purchase' as const,
        coin_name: trans.coins?.name || 'Unknown Coin',
        coin_image: trans.coins?.image,
        price: trans.amount,
        created_at: trans.created_at || ''
      })));
    }

    // Sort by date and take top 5
    const sortedActivities = activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    setRecentActivity(sortedActivities);
  };

  return {
    stats,
    recentActivity,
    loading,
    refreshStats: fetchEnhancedStats
  };
};
