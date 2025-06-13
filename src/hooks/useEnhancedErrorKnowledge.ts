
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EnhancedErrorKnowledge {
  id: string;
  error_name: string;
  error_type: string;
  error_category: string;
  description: string;
  severity_level?: number;
  rarity_score?: number;
  detection_difficulty?: number;
  market_premium_multiplier?: number;
  historical_significance?: string;
  identification_techniques?: string[];
  common_mistakes?: string[];
  detection_keywords?: string[];
  visual_markers?: Record<string, any>;
  cross_reference_coins?: string[];
  technical_specifications?: Record<string, any>;
  ai_detection_markers?: Record<string, any>;
  reference_links?: string[];
  created_at: string;
  updated_at: string;
}

export interface ErrorMarketData {
  id: string;
  knowledge_base_id?: string;
  static_coin_id?: string;
  grade: string;
  market_value_low?: number;
  market_value_avg?: number;
  market_value_high?: number;
  last_sale_price?: number;
  premium_percentage?: number;
  market_trend?: string;
  data_confidence?: number;
  grade_impact_factor?: number;
  condition_adjustments?: Record<string, any>;
  regional_pricing?: Record<string, any>;
  auction_vs_retail_ratio?: number;
  source_references?: string[];
  created_at: string;
  updated_at: string;
}

export const useEnhancedErrorKnowledge = () => {
  return useQuery({
    queryKey: ['enhanced-error-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('rarity_score', { ascending: false });
      
      if (error) throw error;
      return data as EnhancedErrorKnowledge[];
    }
  });
};

export const useErrorMarketData = () => {
  return useQuery({
    queryKey: ['error-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select(`
          *,
          error_coins_knowledge(error_name, error_type, error_category)
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ErrorMarketData[];
    }
  });
};

export const useAddEnhancedErrorKnowledge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<EnhancedErrorKnowledge, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('error_coins_knowledge')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-error-knowledge'] });
      toast({
        title: "Success",
        description: "Enhanced error knowledge added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add error knowledge: " + error.message,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateEnhancedErrorKnowledge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<EnhancedErrorKnowledge> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('error_coins_knowledge')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-error-knowledge'] });
      toast({
        title: "Success", 
        description: "Error knowledge updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update error knowledge: " + error.message,
        variant: "destructive",
      });
    }
  });
};

export const useDetectCoinErrors = () => {
  return useMutation({
    mutationFn: async ({ 
      imageHash, 
      coinInfo, 
      detectionConfig = {} 
    }: {
      imageHash: string;
      coinInfo: Record<string, any>;
      detectionConfig?: Record<string, any>;
    }) => {
      const { data, error } = await supabase.rpc('detect_coin_errors', {
        p_image_hash: imageHash,
        p_coin_info: coinInfo,
        p_detection_config: detectionConfig
      });

      if (error) throw error;
      return data;
    },
    onError: (error: Error) => {
      toast({
        title: "Detection Failed",
        description: "Failed to detect coin errors: " + error.message,
        variant: "destructive",
      });
    }
  });
};
