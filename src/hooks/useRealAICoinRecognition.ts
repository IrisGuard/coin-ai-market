
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIRecognitionResult {
  success: boolean;
  confidence: number;
  provider: string;
  identification: {
    name: string;
    year: number;
    country: string;
    denomination: string;
    mint?: string;
    series?: string;
    type?: string;
  };
  grading: {
    condition: string;
    grade: string;
    details?: string;
    pcgs_grade?: string;
    ngc_grade?: string;
  };
  valuation: {
    current_value: number;
    low_estimate?: number;
    high_estimate?: number;
    market_trend?: string;
    last_sale?: number;
  };
  specifications: {
    composition?: string;
    diameter?: number;
    weight?: number;
    edge?: string;
    designer?: string;
  };
  rarity: string;
  pcgs_number?: string;
  ngc_number?: string;
  errors: string[];
  varieties: string[];
}

export const useRealAICoinRecognition = () => {
  return useMutation({
    mutationFn: async (imageData: { 
      image: string; 
      additionalImages?: string[]; 
      aiProvider?: string 
    }): Promise<AIRecognitionResult> => {
      console.log('Starting real AI coin recognition...');
      
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
          description: `${data.identification.name} identified with ${Math.round(data.confidence * 100)}% confidence`,
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
