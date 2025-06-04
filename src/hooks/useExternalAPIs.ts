
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePCGSData = () => {
  return useMutation({
    mutationFn: async (pcgsNumber: string) => {
      const { data, error } = await supabase.functions.invoke('pcgs-integration', {
        body: { pcgs_number: pcgsNumber }
      });

      if (error) throw error;
      return data;
    },
    onError: (error: unknown) => {
      console.error('PCGS API Error:', error);
    },
  });
};

export const useNGCData = () => {
  return useMutation({
    mutationFn: async (ngcNumber: string) => {
      const { data, error } = await supabase.functions.invoke('ngc-integration', {
        body: { ngc_number: ngcNumber }
      });

      if (error) throw error;
      return data;
    },
    onError: (error: unknown) => {
      console.error('NGC API Error:', error);
    },
  });
};
