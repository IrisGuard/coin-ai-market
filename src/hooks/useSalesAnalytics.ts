import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SalesMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalTransactions: number;
  transactionsGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
  topSellingCoins: Array<{
    coinId: string;
    coinName: string;
    totalSales: number;
    revenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;
}

export const useSalesAnalytics = (timeframe: '7d' | '30d' | '90d' = '30d') => {
  return useQuery({
    queryKey: ['sales-analytics', timeframe],
    queryFn: async (): Promise<SalesMetrics> => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const previousStartDate = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

      // Get transaction data
      const [
        { data: currentTransactions },
        { data: previousTransactions },
        { data: coinData }
      ] = await Promise.all([
        supabase
          .from('payment_transactions')
          .select('*')
          .eq('status', 'completed')
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('payment_transactions')
          .select('*')
          .eq('status', 'completed')
          .gte('created_at', previousStartDate.toISOString())
          .lt('created_at', startDate.toISOString()),
        supabase
          .from('coins')
          .select('id, name, category, price')
      ]);

      // Calculate basic metrics
      const totalRevenue = currentTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const previousRevenue = previousTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const totalTransactions = currentTransactions?.length || 0;
      const previousTransactionCount = previousTransactions?.length || 0;
      const transactionsGrowth = previousTransactionCount > 0 
        ? ((totalTransactions - previousTransactionCount) / previousTransactionCount) * 100 
        : 0;

      const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Calculate top selling coins
      const coinSales: Record<string, { name: string; count: number; revenue: number }> = {};
      currentTransactions?.forEach(transaction => {
        if (transaction.coin_id) {
          const coin = coinData?.find(c => c.id === transaction.coin_id);
          if (coin) {
            if (!coinSales[transaction.coin_id]) {
              coinSales[transaction.coin_id] = { name: coin.name, count: 0, revenue: 0 };
            }
            coinSales[transaction.coin_id].count += 1;
            coinSales[transaction.coin_id].revenue += transaction.amount || 0;
          }
        }
      });

      const topSellingCoins = Object.entries(coinSales)
        .map(([coinId, data]) => ({
          coinId,
          coinName: data.name,
          totalSales: data.count,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Calculate revenue by category
      const categoryRevenue: Record<string, number> = {};
      let totalCategoryRevenue = 0;
      
      currentTransactions?.forEach(transaction => {
        if (transaction.coin_id) {
          const coin = coinData?.find(c => c.id === transaction.coin_id);
          if (coin && coin.category) {
            const category = coin.category as string;
            categoryRevenue[category] = (categoryRevenue[category] || 0) + (transaction.amount || 0);
            totalCategoryRevenue += transaction.amount || 0;
          }
        }
      });

      const revenueByCategory = Object.entries(categoryRevenue)
        .map(([category, revenue]) => ({
          category,
          revenue,
          percentage: totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0
        }))
        .sort((a, b) => b.revenue - a.revenue);

      // Generate daily revenue for chart
      const dailyRevenue: Array<{ date: string; revenue: number; transactions: number }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayTransactions = currentTransactions?.filter(t => {
          const transactionDate = new Date(t.created_at);
          return transactionDate >= dayStart && transactionDate <= dayEnd;
        }) || [];

        dailyRevenue.push({
          date: dayStart.toISOString().split('T')[0],
          revenue: dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          transactions: dayTransactions.length
        });
      }

      // Payment methods analysis
      const paymentMethodStats: Record<string, { count: number; revenue: number }> = {};
      currentTransactions?.forEach(transaction => {
        const method = transaction.payment_method || 'unknown';
        if (!paymentMethodStats[method]) {
          paymentMethodStats[method] = { count: 0, revenue: 0 };
        }
        paymentMethodStats[method].count += 1;
        paymentMethodStats[method].revenue += transaction.amount || 0;
      });

      const paymentMethods = Object.entries(paymentMethodStats)
        .map(([method, data]) => ({
          method,
          count: data.count,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue);

      // Calculate conversion rate (assuming page views data exists)
      const { data: pageViews } = await supabase
        .from('analytics_events')
        .select('id')
        .eq('event_type', 'page_view')
        .gte('timestamp', startDate.toISOString());

      const totalViews = pageViews?.length || 1;
      const conversionRate = (totalTransactions / totalViews) * 100;

      return {
        totalRevenue,
        revenueGrowth,
        totalTransactions,
        transactionsGrowth,
        averageOrderValue,
        conversionRate,
        topSellingCoins,
        revenueByCategory,
        dailyRevenue,
        paymentMethods
      };
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });
};