
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdvancedAnalyticsDashboard = () => {
  return useQuery({
    queryKey: ['advanced-analytics-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_advanced_analytics_dashboard');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useAdvancedAnalytics = () => {
  return useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
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
      
      if (error) throw error;
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
      
      if (error) throw error;
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      // Mock AI insights data for now
      return {
        recommendations: [
          {
            type: 'market_opportunity',
            title: 'High Value Coin Categories',
            description: 'Consider expanding inventory in Morgan Silver Dollars - 34% price increase detected',
            priority: 'high',
            confidence: 0.89
          },
          {
            type: 'user_behavior',
            title: 'Mobile Traffic Optimization',
            description: 'Mobile users spend 45% more time on listing pages but convert 23% less',
            priority: 'medium',
            confidence: 0.76
          }
        ],
        predictions: [
          {
            category: 'market_trend',
            prediction: 'Ancient Roman coins expected to increase 12-18% in next quarter',
            timeframe: '3 months',
            confidence: 0.82
          },
          {
            category: 'user_growth',
            prediction: 'Premium memberships likely to grow 25% based on current engagement',
            timeframe: '6 months',
            confidence: 0.74
          }
        ]
      };
    },
  });
};

export const useCreateRevenueForecast = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (forecastData: {
      forecast_type: string;
      forecast_period: string;
      predicted_revenue: number;
      confidence_score?: number;
      contributing_factors?: any;
      model_parameters?: any;
    }) => {
      const { data, error } = await supabase
        .from('revenue_forecasts')
        .insert(forecastData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenue-forecasts'] });
      toast({
        title: "Success",
        description: "Revenue forecast created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create revenue forecast: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
