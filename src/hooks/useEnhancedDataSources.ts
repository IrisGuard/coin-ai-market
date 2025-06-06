
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hook for external price sources - using real table
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

// Hook for error coins database - using real table
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

// Hook for coin price history - now using real table
export const useCoinPriceHistory = (coinIdentifier?: string) => {
  return useQuery({
    queryKey: ['coin-price-history', coinIdentifier],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coin_price_history')
        .select('*')
        .eq('coin_identifier', coinIdentifier!)
        .order('date_recorded', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!coinIdentifier,
  });
};

// Hook for aggregated coin prices - now using real table
export const useAggregatedPrices = () => {
  return useQuery({
    queryKey: ['aggregated-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_coin_prices')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for proxy rotation logs - now using real table
export const useProxyRotationLogs = () => {
  return useQuery({
    queryKey: ['proxy-rotation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proxy_rotation_log')
        .select(`
          *,
          vpn_proxies(name, country_code),
          external_price_sources(source_name)
        `)
        .order('rotation_time', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for AI recognition cache - now using real table
export const useAIRecognitionCache = () => {
  return useQuery({
    queryKey: ['ai-recognition-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for scraping schedules - now using real table
export const useScrapingSchedules = () => {
  return useQuery({
    queryKey: ['scraping-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_schedules')
        .select(`
          *,
          external_price_sources(source_name, base_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for user portfolios - NEW real functionality
export const useUserPortfolio = (userId?: string) => {
  return useQuery({
    queryKey: ['user-portfolio', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_portfolios')
        .select(`
          *,
          coins(
            id,
            name,
            image,
            price,
            year,
            country,
            grade,
            rarity
          )
        `)
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};

// Mutation for updating external source
export const useUpdateExternalSource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
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
      schedule_type: string;
      cron_expression: string;
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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};

// Mutation for adding coin to portfolio
export const useAddToPortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (portfolioData: {
      user_id: string;
      coin_id: string;
      purchase_price?: number;
      quantity?: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('user_portfolios')
        .insert(portfolioData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-portfolio'] });
      toast({
        title: "Added to Portfolio",
        description: "Coin has been added to your portfolio successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};

// Mutation for triggering price aggregation
export const useTriggerPriceAggregation = () => {
  return useMutation({
    mutationFn: async (coinIdentifier: string) => {
      // Call the price aggregator edge function
      const { data, error } = await supabase.functions.invoke('price-aggregator', {
        body: { coinIdentifier }
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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};
