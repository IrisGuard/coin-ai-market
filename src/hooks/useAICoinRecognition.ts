
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICoinRecognition = () => {
  return useMutation({
    mutationFn: async (imageData: { 
      image: string; 
      additionalImages?: string[]; 
      aiProvider?: string;
      useGlobalBrain?: boolean;
    }) => {
      // Determine which AI system to use
      const useGlobalAI = imageData.useGlobalBrain !== false; // Default to true
      
      if (useGlobalAI) {
        console.log('🧠 Using Global AI Brain for enhanced analysis...');
        
        // Use the new Global AI Brain system
        const { data, error } = await supabase.functions.invoke('global-ai-brain', {
          body: {
            image: imageData.image.split(',')[1], // Remove data:image/jpeg;base64, prefix
            additionalImages: imageData.additionalImages || [],
            analysisDepth: 'comprehensive'
          }
        });

        if (error) {
          console.error('Global AI Brain error:', error);
          // Fallback to Claude AI
          return await fallbackToClaudeAI(imageData);
        }

        return data;
      } else {
        // Use only anthropic-coin-recognition function (Claude AI)
        return await fallbackToClaudeAI(imageData);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        const isGlobalAnalysis = data.metadata?.ai_provider === 'global-ai-brain';
        const sourcesCount = data.metadata?.sources_consulted || 1;
        
        toast({
          title: isGlobalAnalysis ? "🧠 Global AI Brain Analysis Complete" : "Claude AI Analysis Complete",
          description: `${data.analysis?.name || 'Coin'} identified with ${Math.round((data.analysis?.confidence || 0.5) * 100)}% confidence${isGlobalAnalysis ? ` from ${sourcesCount} global sources` : ''}`,
          duration: isGlobalAnalysis ? 6000 : 4000,
        });

        // Additional notifications for Global AI features
        if (isGlobalAnalysis && data.analysis?.error_coin_detected) {
          toast({
            title: "⚠️ Error Coin Detected!",
            description: `Potential error patterns found: ${data.analysis.error_types?.join(', ') || 'Various patterns'}`,
            duration: 7000,
          });
        }

        if (isGlobalAnalysis && data.analysis?.multi_source_verified) {
          toast({
            title: "✅ Multi-Source Verified",
            description: `Data verified across ${data.analysis.sources_verified} independent sources`,
            duration: 5000,
          });
        }
      }
    },
    onError: (error: unknown) => {
      console.error('AI recognition failed:', error);
      toast({
        title: "Recognition Failed",
        description: error instanceof Error ? error.message : "Unable to analyze the coin image. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Fallback function for Claude AI only
async function fallbackToClaudeAI(imageData: any) {
  console.log('🔄 Falling back to Claude AI...');
  
  const { data, error } = await supabase.functions.invoke('anthropic-coin-recognition', {
    body: {
      image: imageData.image.split(',')[1], // Remove data:image/jpeg;base64, prefix
      analysis_type: 'comprehensive',
      include_valuation: true,
      include_errors: true
    }
  });

  if (error) {
    console.error('Claude AI recognition error:', error);
    throw error;
  }

  return data;
}
