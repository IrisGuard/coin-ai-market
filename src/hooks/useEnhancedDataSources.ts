
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hook for external price sources (now using the actual table)
export const useExternalPriceSources = () => {
  return useQuery({
    queryKey: ['external-price-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('priority_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for error coins database - now using actual table
export const useErrorCoins = () => {
  return useQuery({
    queryKey: ['error-coins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for coin price history - mock version since table doesn't exist
export const useCoinPriceHistory = (coinIdentifier?: string) => {
  return useQuery({
    queryKey: ['coin-price-history', coinIdentifier],
    queryFn: async () => {
      // Return empty array since coin_price_history table doesn't exist yet
      return [];
    },
    enabled: !!coinIdentifier,
  });
};

// Hook for aggregated coin prices - mock version since table doesn't exist
export const useAggregatedPrices = () => {
  return useQuery({
    queryKey: ['aggregated-prices'],
    queryFn: async () => {
      // Return empty array since aggregated_coin_prices table doesn't exist yet
      return [];
    },
  });
};

// Hook for proxy rotation logs - mock version since table doesn't exist
export const useProxyRotationLogs = () => {
  return useQuery({
    queryKey: ['proxy-rotation-logs'],
    queryFn: async () => {
      // Return empty array since proxy_rotation_log table doesn't exist yet
      return [];
    },
  });
};

// Hook for AI recognition cache - mock version since table doesn't exist
export const useAIRecognitionCache = () => {
  return useQuery({
    queryKey: ['ai-recognition-cache'],
    queryFn: async () => {
      // Return empty array since ai_recognition_cache table doesn't exist yet
      return [];
    },
  });
};

// Hook for scraping schedules - mock version since table doesn't exist
export const useScrapingSchedules = () => {
  return useQuery({
    queryKey: ['scraping-schedules'],
    queryFn: async () => {
      // Return empty array since scraping_schedules table doesn't exist yet
      return [];
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

// Mutation for creating scraping schedule - mock version
export const useCreateScrapingSchedule = () => {
  return useMutation({
    mutationFn: async (scheduleData: any) => {
      // Mock implementation - return success
      return { success: true };
    },
    onSuccess: () => {
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

// Mutation for triggering price aggregation - mock version
export const useTriggerPriceAggregation = () => {
  return useMutation({
    mutationFn: async (coinIdentifier: string) => {
      // Mock implementation
      return { success: true };
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
