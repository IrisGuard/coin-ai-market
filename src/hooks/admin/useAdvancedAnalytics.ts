
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
      // Mock AI insights data
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
          { type: 'price_forecast', confidence: 0.87, timeframe: '30_days' },
          { type: 'demand_forecast', confidence: 0.92, timeframe: '7_days' }
        ]
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};
