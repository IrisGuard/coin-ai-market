
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedErrorKnowledge = () => {
  return useQuery({
    queryKey: ['enhanced-error-knowledge'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching error knowledge:', error);
        return [];
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
        console.error('Error fetching market data:', error);
        return [];
      }
      
      return data || [];
    }
  });
};

export const useDetectCoinErrors = () => {
  return useMutation({
    mutationFn: async (params: {
      imageHash: string;
      coinInfo: {
        keywords: string[];
        category: string;
        type: string;
      };
      detectionConfig: {
        min_confidence: number;
      };
    }) => {
      // Simulate AI error detection
      const detectionResult = {
        detected_errors: [
          {
            error_type: 'die_crack',
            confidence: 0.85,
            location: 'obverse_rim',
            severity: 'moderate'
          },
          {
            error_type: 'off_center',
            confidence: 0.92,
            location: 'entire_coin',
            severity: 'minor'
          }
        ],
        confidence_scores: {
          overall: 0.88,
          die_crack: 0.85,
          off_center: 0.92
        },
        processing_time_ms: 1250
      };

      // Log the detection
      const { error } = await supabase
        .from('ai_error_detection_logs')
        .insert({
          image_hash: params.imageHash,
          detected_errors: detectionResult.detected_errors,
          confidence_scores: detectionResult.confidence_scores,
          processing_time_ms: detectionResult.processing_time_ms
        });

      if (error) {
        console.error('Error logging detection:', error);
        throw error;
      }

      return detectionResult;
    }
  });
};
