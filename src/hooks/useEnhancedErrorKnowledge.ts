
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
