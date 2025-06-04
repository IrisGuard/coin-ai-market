
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICoinRecognition = () => {
  return useMutation({
    mutationFn: async (imageData: { image: string; additionalImages?: string[] }) => {
      console.log('Starting AI coin recognition...');
      
      const { data, error } = await supabase.functions.invoke('ai-coin-recognition', {
        body: imageData
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
          description: `${data.name} identified with ${Math.round(data.confidence * 100)}% confidence`,
        });
      }
    },
    onError: (error: any) => {
      console.error('AI recognition failed:', error);
      toast({
        title: "Recognition Failed",
        description: error.message || "Unable to analyze the coin image. Please try again.",
        variant: "destructive",
      });
    },
  });
};
