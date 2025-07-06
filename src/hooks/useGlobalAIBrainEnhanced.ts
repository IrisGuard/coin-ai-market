import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GlobalAIBrainEnhancedRequest {
  image: string;
  additionalImages?: string[];
  category?: 'coins' | 'banknotes' | 'bullion' | 'auto-detect';
  analysisDepth?: 'basic' | 'comprehensive' | 'deep';
  userLocation?: string;
  enableLearning?: boolean;
}

interface GlobalAIBrainEnhancedResponse {
  success: boolean;
  analysis: {
    // Core analysis (all in English)
    name: string;
    year: number | null;
    country: string;
    denomination: string;
    composition: string;
    grade: string;
    estimated_value: number;
    rarity: string;
    confidence: number;
    
    // Enhanced global data
    error_types: string[];
    market_trend: string;
    price_range: { min: number; max: number };
    sources_verified: number;
    similar_coins: any[];
    
    // AI Brain specific
    global_analysis: boolean;
    multi_source_verified: boolean;
    error_coin_detected: boolean;
    languages_processed: string[];
    category_detected: string;
  };
  metadata: {
    processing_time: number;
    sources_consulted: number;
    sources_successful: number;
    ai_provider: string;
    analysis_depth: string;
    learning_session_id: string | null;
    timestamp: string;
  };
}

export const useGlobalAIBrainEnhanced = () => {
  return useMutation({
    mutationFn: async (requestData: GlobalAIBrainEnhancedRequest): Promise<GlobalAIBrainEnhancedResponse> => {
      console.log('🧠 Calling Global AI Brain Enhanced...', requestData);
      
      const { data, error } = await supabase.functions.invoke('global-ai-brain-enhanced', {
        body: {
          ...requestData,
          enableLearning: true // Always enable learning for continuous improvement
        }
      });

      if (error) {
        console.error('❌ Global AI Brain Enhanced error:', error);
        throw new Error(error.message || 'AI analysis failed');
      }

      if (!data?.success) {
        console.error('❌ AI analysis unsuccessful:', data);
        throw new Error('AI analysis was unsuccessful');
      }

      console.log('✅ Global AI Brain Enhanced response:', data);
      return data;
    },
    onSuccess: (data) => {
      const sourcesText = data.metadata.sources_successful > 1 
        ? `${data.metadata.sources_successful} sources` 
        : '1 source';
      
      toast({
        title: "AI Analysis Complete",
        description: `Multi-category analysis completed using ${sourcesText} with ${Math.round(data.analysis.confidence * 100)}% confidence`,
      });
    },
    onError: (error: any) => {
      console.error('❌ Global AI Brain Enhanced mutation error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the item. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export default useGlobalAIBrainEnhanced;