
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealExternalSources = () => {
  return useQuery({
    queryKey: ['real-external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .eq('is_active', true)
        .order('priority_score', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching external sources:', error);
        throw error;
      }
      
      console.log('✅ Real external sources loaded:', data?.length);
      return data || [];
    }
  });
};
