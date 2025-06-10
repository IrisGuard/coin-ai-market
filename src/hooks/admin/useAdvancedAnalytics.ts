
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
