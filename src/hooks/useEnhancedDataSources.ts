
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hook for external price sources
export const useExternalPriceSources = () => {
  return useQuery({
    queryKey: ['external-price-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for error coins database
export const useErrorCoins = () => {
  return useQuery({
    queryKey: ['error-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_db')
        .select(`
          *,
          static_coins_db(name, country, denomination, year_start, year_end)
        `)
        .order('rarity_multiplier', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for coin price history
export const useCoinPriceHistory = (coinIdentifier?: string) => {
  return useQuery({
    queryKey: ['coin-price-history', coinIdentifier],
    queryFn: async () => {
      let query = supabase
        .from('coin_price_history')
        .select(`
          *,
          external_price_sources(source_name, source_type)
        `)
        .order('sale_date', { ascending: false });

      if (coinIdentifier) {
        query = query.eq('coin_identifier', coinIdentifier);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: !!coinIdentifier,
  });
};

// Hook for aggregated coin prices
export const useAggregatedPrices = () => {
  return useQuery({
    queryKey: ['aggregated-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_coin_prices')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for proxy rotation logs
export const useProxyRotationLogs = () => {
  return useQuery({
    queryKey: ['proxy-rotation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proxy_rotation_log')
        .select(`
          *,
          vpn_proxies(name, country_code, endpoint),
          external_price_sources(source_name, source_type)
        `)
        .order('last_used', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for AI recognition cache
export const useAIRecognitionCache = () => {
  return useQuery({
    queryKey: ['ai-recognition-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook for scraping schedules
export const useScrapingSchedules = () => {
  return useQuery({
    queryKey: ['scraping-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_schedules')
        .select(`
          *,
          external_price_sources(source_name, source_type, base_url)
        `)
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

// Mutation for creating external price source
export const useCreateExternalSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sourceData: {
      source_name: string;
      source_type: string;
      base_url: string;
      scraping_config?: any;
      requires_proxy?: boolean;
      rate_limit_per_hour?: number;
    }) => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .insert(sourceData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-price-sources'] });
      toast({
        title: "External Source Added",
        description: "New external price source has been configured successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mutation for updating external source
export const useUpdateExternalSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('external_price_sources')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-price-sources'] });
      toast({
        title: "Source Updated",
        description: "External price source has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mutation for creating scraping schedule
export const useCreateScrapingSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scheduleData: {
      source_id: string;
      schedule_pattern: string;
      priority?: number;
      max_pages_per_run?: number;
    }) => {
      const { data, error } = await supabase
        .from('scraping_schedules')
        .insert(scheduleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraping-schedules'] });
      toast({
        title: "Schedule Created",
        description: "Scraping schedule has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Mutation for triggering price aggregation
export const useTriggerPriceAggregation = () => {
  return useMutation({
    mutationFn: async (coinIdentifier: string) => {
      // This would trigger the aggregation process
      const { data, error } = await supabase.functions.invoke('price-aggregator', {
        body: { coin_identifier: coinIdentifier }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Price Aggregation Started",
        description: "Price aggregation process has been triggered.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
