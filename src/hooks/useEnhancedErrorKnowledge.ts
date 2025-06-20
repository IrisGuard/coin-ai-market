
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedErrorKnowledge = () => {
  return useQuery({
    queryKey: ['enhanced-error-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('rarity_score', { ascending: false });
      
      if (error) {
        console.error('Error fetching error knowledge:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useErrorMarketData = () => {
  return useQuery({
    queryKey: ['error-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching error market data:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useDetectCoinErrors = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ imageHash, coinInfo, detectionConfig }: {
      imageHash: string;
      coinInfo: any;
      detectionConfig: any;
    }) => {
      const { data, error } = await supabase.rpc('detect_coin_errors', {
        p_image_hash: imageHash,
        p_base_coin_info: coinInfo,
        p_detection_config: detectionConfig
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-error-knowledge'] });
    }
  });
};

export const useCalculateErrorCoinValue = () => {
  return useMutation({
    mutationFn: async ({ errorId, grade, baseCoinValue }: {
      errorId: string;
      grade: string;
      baseCoinValue: number;
    }) => {
      const { data, error } = await supabase.rpc('calculate_error_coin_value', {
        p_error_id: errorId,
        p_grade: grade,
        p_base_coin_value: baseCoinValue
      });
      
      if (error) throw error;
      return data;
    }
  });
};
