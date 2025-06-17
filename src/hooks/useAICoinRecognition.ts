
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICoinRecognition = () => {
  return useMutation({
    mutationFn: async (imageData: { image: string; additionalImages?: string[]; aiProvider?: string }) => {
      console.log('Starting Claude AI coin recognition...');
      
      // Use only anthropic-coin-recognition function (Claude AI)
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

      console.log('Claude AI recognition result:', data);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Claude AI Analysis Complete",
          description: `${data.analysis?.name || 'Coin'} identified with ${Math.round((data.analysis?.confidence || 0.5) * 100)}% confidence`,
        });
      }
    },
    onError: (error: unknown) => {
      console.error('Claude AI recognition failed:', error);
      toast({
        title: "Recognition Failed",
        description: error instanceof Error ? error.message : "Unable to analyze the coin image. Please try again.",
        variant: "destructive",
      });
    },
  });
};
