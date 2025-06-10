
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  userGrowth: { month: string; users: number; growth: number }[];
  coinAnalytics: { category: string; count: number; value: number }[];
  marketTrends: { date: string; volume: number; transactions: number }[];
  performanceMetrics: {
    avgResponseTime: number;
    errorRate: number;
    uptime: number;
    activeUsers: number;
  };
}

export const useAdvancedAnalytics = () => {
  return useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async (): Promise<AnalyticsData> => {
      // Get user growth data
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      // Get coin analytics
      const { data: coins } = await supabase
        .from('coins')
        .select('category, price, created_at');

      // Get transaction data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      // Process user growth by month
      const userGrowthMap = new Map();
      users?.forEach(user => {
        const month = new Date(user.created_at).toISOString().slice(0, 7);
        userGrowthMap.set(month, (userGrowthMap.get(month) || 0) + 1);
      });

      const userGrowth = Array.from(userGrowthMap.entries()).map(([month, count], index, arr) => {
        const prevCount = index > 0 ? arr[index - 1][1] : 0;
        const growth = prevCount > 0 ? ((count - prevCount) / prevCount) * 100 : 0;
        return { month, users: count, growth };
      });

      // Process coin analytics by category
      const coinCategoryMap = new Map();
      coins?.forEach(coin => {
        const category = coin.category || 'uncategorized';
        const existing = coinCategoryMap.get(category) || { count: 0, value: 0 };
        coinCategoryMap.set(category, {
          count: existing.count + 1,
          value: existing.value + (coin.price || 0)
        });
      });

      const coinAnalytics = Array.from(coinCategoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        value: data.value
      }));

      // Process market trends
      const marketTrendsMap = new Map();
      transactions?.forEach(transaction => {
        const date = new Date(transaction.created_at).toISOString().slice(0, 10);
        const existing = marketTrendsMap.get(date) || { volume: 0, transactions: 0 };
        marketTrendsMap.set(date, {
          volume: existing.volume + (transaction.amount || 0),
          transactions: existing.transactions + 1
        });
      });

      const marketTrends = Array.from(marketTrendsMap.entries()).map(([date, data]) => ({
        date,
        volume: data.volume,
        transactions: data.transactions
      }));

      // Mock performance metrics (in real app, these would come from monitoring)
      const performanceMetrics = {
        avgResponseTime: 245,
        errorRate: 1.2,
        uptime: 99.8,
        activeUsers: users?.length || 0
      };

      return {
        userGrowth,
        coinAnalytics,
        marketTrends,
        performanceMetrics
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      // Mock AI insights - in real app, this would call AI service
      return {
        recommendations: [
          {
            type: 'market_opportunity',
            title: 'Morgan Silver Dollars Trending Up',
            description: 'AI detected 23% increase in interest for Morgan Silver Dollars this week',
            confidence: 0.87,
            priority: 'high'
          },
          {
            type: 'user_behavior',
            title: 'Mobile Usage Growing',
            description: 'Mobile uploads increased by 45% - consider mobile-first features',
            confidence: 0.92,
            priority: 'medium'
          },
          {
            type: 'inventory_optimization',
            title: 'Low Inventory Alert',
            description: 'Roman coins category showing high demand but low supply',
            confidence: 0.76,
            priority: 'high'
          }
        ],
        predictions: [
          {
            category: 'market_volume',
            prediction: 'Market volume expected to increase by 15% next month',
            confidence: 0.84,
            timeframe: '30 days'
          },
          {
            category: 'user_growth',
            prediction: 'User registrations projected to grow by 8% this quarter',
            confidence: 0.79,
            timeframe: '90 days'
          }
        ]
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
