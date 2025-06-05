
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useErrorCoinsKnowledge = () => {
  return useQuery({
    queryKey: ['error-coins-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('error_category', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useErrorCoinsMarketData = () => {
  return useQuery({
    queryKey: ['error-coins-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select(`
          *,
          error_coins_knowledge(error_name, error_type, error_category),
          static_coins_db(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useErrorReferenceSource = () => {
  return useQuery({
    queryKey: ['error-reference-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_reference_sources')
        .select('*')
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useAddErrorKnowledge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (knowledgeData: {
      error_name: string;
      error_type: string;
      error_category: string;
      description: string;
      severity_level?: number;
      rarity_score?: number;
      identification_techniques?: string[];
      common_mistakes?: string[];
      technical_specifications?: Record<string, any>;
      ai_detection_markers?: Record<string, any>;
      reference_links?: string[];
    }) => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .insert(knowledgeData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-knowledge'] });
      toast({
        title: "Success",
        description: "Error knowledge added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add error knowledge: " + (error.message || 'Unknown error'),
        variant: "destructive",
      });
    }
  });
};

export const useAddErrorMarketData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (marketData: {
      grade: string;
      knowledge_base_id?: string;
      static_coin_id?: string;
      market_value_low?: number;
      market_value_high?: number;
      market_value_avg?: number;
      last_sale_price?: number;
      market_trend?: string;
      data_confidence?: number;
      premium_percentage?: number;
      source_references?: string[];
    }) => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .insert(marketData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-market-data'] });
      toast({
        title: "Success",
        description: "Market data added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add market data: " + (error.message || 'Unknown error'),
        variant: "destructive",
      });
    }
  });
};
