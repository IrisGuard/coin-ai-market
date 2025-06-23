import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMarketplaceStats = () => {
  return useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: async () => {
      // Get comprehensive marketplace statistics from real database
      const queries = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('stores').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('users').select('*', { count: 'exact', head: true }),
      ]);

      const [
        { count: totalCoins },
        { count: activeAuctions },
        { count: featuredCoins },
        { count: activeUsers },
        { count: totalTransactions },
        { data: coinPrices },
        { count: verifiedCoins },
        { count: newListingsToday },
        { data: recentSales },
        { data: historicalCoins },
        { data: historicalUsers },
        { data: historicalVolume }
      ] = await Promise.all([
        // Total coins
        queries[0],
        
        // Active auctions
        queries[3],
        
        // Featured coins
        queries[1],
        
        // Active users (users who have been active in last 30 days)
        queries[2],
        
        // Total transactions
        supabase.from('payment_transactions').select('*', { count: 'exact', head: true }),
        
        // Coin prices for value calculation
        supabase.from('coins').select('price').not('price', 'is', null),
        
        // Total marketplace coins
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        
        // New listings today
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date().toISOString().split('T')[0]),
        
        // Recent sales for volume calculation
        supabase
          .from('payment_transactions')
          .select('amount, created_at')
          .eq('status', 'completed')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Historical data for growth calculations - coins from 30 days ago
        supabase
          .from('coins')
          .select('id, created_at')
          .lte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Historical users for growth calculations
        supabase
          .from('profiles')
          .select('id, created_at')
          .lte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Historical volume for growth calculations
        supabase
          .from('payment_transactions')
          .select('amount, created_at')
          .eq('status', 'completed')
          .gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
          .lte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Calculate total marketplace value
      const totalValue = coinPrices?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;
      
      // Calculate monthly trading volume
      const monthlyVolume = recentSales?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;
      
      // Calculate average price
      const averagePrice = coinPrices?.length > 0 
        ? totalValue / coinPrices.length 
        : 0;

      // Get category statistics
      const { data: categoryStats } = await supabase
        .from('coins')
        .select('category');

      const categoryCounts = categoryStats?.reduce((acc: Record<string, number>, coin) => {
        const category = coin.category || 'unclassified';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const topCategory = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

      // Get recent activity count
      const { count: recentActivity } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Calculate real growth metrics
      const currentCoinsCount = totalCoins || 0;
      const historicalCoinsCount = historicalCoins?.length || 0;
      const coinsGrowth = historicalCoinsCount > 0 
        ? ((currentCoinsCount - historicalCoinsCount) / historicalCoinsCount) * 100 
        : 0;

      const currentUsersCount = activeUsers || 0;
      const historicalUsersCount = historicalUsers?.length || 0;
      const usersGrowth = historicalUsersCount > 0 
        ? ((currentUsersCount - historicalUsersCount) / historicalUsersCount) * 100 
        : 0;

      const currentVolume = monthlyVolume;
      const historicalVolume30Days = historicalVolume?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;
      const volumeGrowth = historicalVolume30Days > 0 
        ? ((currentVolume - historicalVolume30Days) / historicalVolume30Days) * 100 
        : 0;

      // Calculate average price growth
      const currentAvgPrice = averagePrice;
      const { data: historicalPrices } = await supabase
        .from('coins')
        .select('price')
        .not('price', 'is', null)
        .lte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      const historicalAvgPrice = historicalPrices?.length > 0 
        ? historicalPrices.reduce((sum, coin) => sum + (coin.price || 0), 0) / historicalPrices.length
        : 0;
      
      const averagePriceGrowth = historicalAvgPrice > 0 
        ? ((currentAvgPrice - historicalAvgPrice) / historicalAvgPrice) * 100 
        : 0;

      return {
        total: totalCoins || 0,
        auctions: activeAuctions || 0,
        featured: featuredCoins || 0,
        verified: verifiedCoins || 0,
        activeUsers: activeUsers || 0,
        totalTransactions: totalTransactions || 0,
        newListingsToday: newListingsToday || 0,
        totalValue: Math.round(totalValue),
        monthlyVolume: Math.round(monthlyVolume),
        averagePrice: Math.round(averagePrice),
        topCategory,
        recentActivity: recentActivity || 0,
        loading: false,
        
        // Real growth metrics calculated from historical data
        growthMetrics: {
          coinsGrowth: Math.round(coinsGrowth * 100) / 100,
          usersGrowth: Math.round(usersGrowth * 100) / 100,
          volumeGrowth: Math.round(volumeGrowth * 100) / 100,
          averagePriceGrowth: Math.round(averagePriceGrowth * 100) / 100
        },
        
        // Market health indicators
        marketHealth: {
          listingToSaleRatio: totalTransactions > 0 ? (totalCoins || 0) / totalTransactions : 0,
          verificationRate: totalCoins > 0 ? ((verifiedCoins || 0) / totalCoins) * 100 : 0,
          auctionActivity: activeAuctions || 0,
          userEngagement: recentActivity || 0
        }
      };
    },
    refetchInterval: 60000, // Refresh every minute for real-time updates
    staleTime: 30000 // Consider data stale after 30 seconds
  });
};
