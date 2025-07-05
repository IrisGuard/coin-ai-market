import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GlobalAIBrainRequest {
  image: string;
  additionalImages?: string[];
  userLocation?: string;
  analysisDepth?: 'basic' | 'comprehensive' | 'deep';
}

interface GlobalAIBrainResponse {
  success: boolean;
  analysis: {
    // Core coin data (all in English)
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
  };
  metadata: {
    processing_time: number;
    sources_consulted: number;
    ai_provider: string;
    analysis_depth: string;
    languages_detected: string[];
    error_patterns_found: number;
    market_sources: number;
    timestamp: string;
  };
}

export const useGlobalAIBrain = () => {
  return useMutation({
    mutationFn: async (requestData: GlobalAIBrainRequest): Promise<GlobalAIBrainResponse> => {
      console.log('🧠 Calling Global AI Brain...');
      
      // Remove data URL prefix if present
      const cleanImage = requestData.image.includes('base64,') 
        ? requestData.image.split('base64,')[1] 
        : requestData.image;

      const { data, error } = await supabase.functions.invoke('global-ai-brain', {
        body: {
          image: cleanImage,
          additionalImages: requestData.additionalImages || [],
          userLocation: requestData.userLocation || 'global',
          analysisDepth: requestData.analysisDepth || 'comprehensive'
        }
      });

      if (error) {
        console.error('❌ Global AI Brain error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Global AI Brain analysis failed');
      }

      console.log('✅ Global AI Brain analysis complete');
      console.log('Sources consulted:', data.metadata.sources_consulted);
      console.log('Processing time:', data.metadata.processing_time + 'ms');
      console.log('Final confidence:', data.analysis.confidence);

      return data;
    },
    onSuccess: (data) => {
      const { analysis, metadata } = data;
      
      toast({
        title: "🧠 Global AI Brain Analysis Complete",
        description: `${analysis.name} identified with ${Math.round(analysis.confidence * 100)}% confidence from ${metadata.sources_consulted} global sources`,
        duration: 5000,
      });

      // Additional success notifications for special cases
      if (analysis.error_coin_detected) {
        toast({
          title: "⚠️ Error Coin Detected!",
          description: `Potential error patterns found: ${analysis.error_types.join(', ')}`,
          duration: 7000,
        });
      }

      if (analysis.multi_source_verified) {
        toast({
          title: "✅ Multi-Source Verified",
          description: `Data verified across ${analysis.sources_verified} independent sources`,
          duration: 4000,
        });
      }

      if (metadata.languages_detected.length > 1) {
        toast({
          title: "🌍 Multi-Language Analysis",
          description: `Processed ${metadata.languages_detected.length} languages: ${metadata.languages_detected.join(', ')}`,
          duration: 4000,
        });
      }
    },
    onError: (error: unknown) => {
      console.error('💥 Global AI Brain failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Global AI Brain analysis failed. Please try again.";

      toast({
        title: "Global AI Brain Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });
    },
  });
};

// Hook for checking Global AI Brain capabilities
export const useGlobalAICapabilities = () => {
  return {
    supportedLanguages: [
      'Arabic', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Greek',
      'Persian', 'Hindi', 'Thai', 'Hebrew', 'Cyrillic', 'Latin'
    ],
    supportedSources: [
      'Heritage Auctions', 'Stack\'s Bowers', 'NGC', 'PCGS',
      'Sixbid', 'MA-Shops', 'Coin Archives', 'NumisBids',
      'Coin Community', 'CoinTalk', 'Error Reference', 'CONECA',
      'uCoin', 'Numista', 'eBay', 'WorthPoint'
    ],
    errorCoinTypes: [
      'Double Die', 'Off Center', 'Broadstrike', 'Clipped Planchet',
      'Die Crack', 'Struck Through', 'Wrong Planchet', 'Multiple Strike'
    ],
    analysisDepths: [
      { value: 'basic', label: 'Basic (5-10 sources)', time: '10-20s' },
      { value: 'comprehensive', label: 'Comprehensive (20-50 sources)', time: '30-60s' },
      { value: 'deep', label: 'Deep Analysis (50+ sources)', time: '60-120s' }
    ]
  };
};

// Hook for Global AI Brain statistics
export const useGlobalAIStats = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('web_discovery_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Calculate statistics
      const totalSessions = data.length;
      const avgSourcesConsulted = data.reduce((sum, session) => 
        sum + (session.sources_attempted || 0), 0) / totalSessions;
      const avgSuccessRate = data.reduce((sum, session) => 
        sum + (session.sources_successful || 0) / Math.max(1, session.sources_attempted || 1), 0) / totalSessions;

      return {
        totalSessions,
        avgSourcesConsulted: Math.round(avgSourcesConsulted),
        avgSuccessRate: Math.round(avgSuccessRate * 100),
        lastUpdated: new Date().toISOString()
      };
    }
  });
};