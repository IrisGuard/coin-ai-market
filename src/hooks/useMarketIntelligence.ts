
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarketIntelligenceReport {
  id: string;
  metric_type: string;
  metric_name: string;
  metric_value: number;
  recorded_at: string;
  category_breakdown: any;
  geographic_data: any;
  trend_analysis: any;
}

export const useMarketIntelligence = () => {
  const queryClient = useQueryClient();

  // Fetch market intelligence reports from market_analytics
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['market-intelligence-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Generate market intelligence report
  const generateReport = useMutation({
    mutationFn: async (params: {
      reportType: string;
      includeGlobalData?: boolean;
      timeframe?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('market-intelligence-engine', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-intelligence-reports'] });
    }
  });

  // Get market sentiment from market analytics
  const { data: sentiment } = useQuery({
    queryKey: ['market-sentiment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .eq('metric_type', 'sentiment')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Get trend analysis from market analytics
  const { data: trends } = useQuery({
    queryKey: ['market-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .eq('metric_type', 'trends')
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  return {
    reports,
    sentiment,
    trends,
    isLoading,
    error,
    generateReport
  };
};

export const useAIPredictions = () => {
  // Fetch AI predictions from AI performance metrics
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    }
  });

  return {
    predictions,
    isLoading
  };
};

export const useMarketMetrics = () => {
  // Real-time market metrics
  const { data: metrics } = useQuery({
    queryKey: ['market-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Process metrics for dashboard display
      const processed = {
        totalVolume: data?.reduce((sum, m) => sum + (m.metric_value || 0), 0) || 0,
        avgMetricValue: data?.reduce((sum, m) => sum + (m.metric_value || 0), 0) / (data?.length || 1) || 0,
        recentTrends: data?.slice(0, 10) || [],
        categoryBreakdown: data?.reduce((acc: any, m) => {
          if (m.category_breakdown) {
            Object.entries(m.category_breakdown).forEach(([key, value]) => {
              acc[key] = (acc[key] || 0) + (value as number);
            });
          }
          return acc;
        }, {})
      };

      return processed;
    },
    refetchInterval: 15000 // Refresh every 15 seconds
  });

  return metrics;
};
