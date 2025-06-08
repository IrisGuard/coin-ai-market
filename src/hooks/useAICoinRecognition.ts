
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICoinRecognition = () => {
  return useMutation({
    mutationFn: async (imageData: { image: string; additionalImages?: string[]; aiProvider?: string }) => {
      console.log('Starting AI coin recognition...');
      
      const { data, error } = await supabase.functions.invoke('custom-ai-recognition', {
        body: {
          ...imageData,
          aiProvider: imageData.aiProvider || 'custom'
        }
      });

      if (error) {
        console.error('AI recognition error:', error);
        throw error;
      }

      console.log('AI recognition result:', data);
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "AI Analysis Complete",
          description: `${data.name || 'Coin'} identified using ${data.provider} with ${Math.round((data.confidence || 0.5) * 100)}% confidence`,
        });
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
