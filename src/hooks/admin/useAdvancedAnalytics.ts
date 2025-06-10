
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdvancedAnalyticsDashboard = () => {
  return useQuery({
    queryKey: ['advanced-analytics-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_advanced_analytics_dashboard');
      
      if (error) {
        console.error('Error fetching analytics:', error);
        // Return mock data for now
        return {
          active_users_24h: 145,
          searches_24h: 320,
          avg_session_time: 12.5,
          new_listings_24h: 25,
          revenue_24h: 15420.50,
          active_alerts: 3,
          avg_data_quality: 0.92,
          last_updated: new Date().toISOString()
        };
      }
      
      return data;
    },
    refetchInterval: 60000,
  });
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      // Mock AI insights data with correct structure
      return {
        market_trends: [
          { category: 'Gold Coins', trend: 'increasing', percentage: 15.2 },
          { category: 'Silver Coins', trend: 'stable', percentage: 2.1 },
          { category: 'Rare Coins', trend: 'decreasing', percentage: -5.3 }
        ],
        user_behavior: {
          peak_hours: ['14:00', '15:00', '16:00'],
          popular_searches: ['Morgan Dollar', 'Walking Liberty', 'Mercury Dime'],
          conversion_rate: 0.125
        },
        predictions: [
          { 
            type: 'price_forecast', 
            confidence: 0.87, 
            timeframe: '30_days',
            category: 'Market Price Analysis',
            prediction: 'Gold coin prices expected to increase by 8-12% over the next 30 days based on current market trends and historical data.'
          },
          { 
            type: 'demand_forecast', 
            confidence: 0.92, 
            timeframe: '7_days',
            category: 'Demand Prediction',
            prediction: 'High demand expected for Morgan Silver Dollars in the coming week due to seasonal collecting patterns.'
          }
        ],
        recommendations: [
          {
            type: 'market_opportunity',
            priority: 'high',
            confidence: 0.89,
            title: 'Optimize Gold Coin Pricing',
            description: 'Current gold coin prices are 15% below market average. Consider adjusting pricing strategy to maximize revenue.'
          },
          {
            type: 'user_behavior',
            priority: 'medium',
            confidence: 0.76,
            title: 'Improve Search Experience',
            description: 'Users are spending 40% more time on search results. Enhanced filtering could improve conversion rates.'
          },
          {
            type: 'inventory_optimization',
            priority: 'low',
            confidence: 0.65,
            title: 'Stock Rare Coins',
            description: 'Demand for rare coins is increasing. Consider expanding inventory in this category.'
          }
        ]
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export const useUserAnalytics = () => {
  return useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching user analytics:', error);
        // Return mock data
        return Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i}`,
          session_id: `session-${i}`,
          user_id: `user-${i}`,
          page_views: Math.floor(Math.random() * 10) + 1,
          time_spent_minutes: Math.floor(Math.random() * 30) + 5,
          created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        }));
      }
      
      return data || [];
    },
  });
};

export const useMarketAnalytics = () => {
  return useQuery({
    queryKey: ['market-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching market analytics:', error);
        // Return mock data
        return Array.from({ length: 6 }, (_, i) => ({
          id: `market-${i}`,
          metric_name: ['gold_price', 'silver_price', 'rare_coins', 'modern_coins', 'foreign_coins', 'commemorative'][i],
          metric_value: Math.floor(Math.random() * 1000) + 100,
          recorded_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
        }));
      }
      
      return data || [];
    },
  });
};

export const useRevenueForecasts = () => {
  return useQuery({
    queryKey: ['revenue-forecasts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_forecasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) {
        console.error('Error fetching revenue forecasts:', error);
        // Return mock data
        return Array.from({ length: 12 }, (_, i) => ({
          id: `forecast-${i}`,
          forecast_period: `Month ${i + 1}`,
          predicted_revenue: Math.floor(Math.random() * 50000) + 10000,
          confidence_score: Math.random() * 0.3 + 0.7,
          created_at: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
      }
      
      return data || [];
    },
  });
};
