
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGeographicRegions = () => {
  return useQuery({
    queryKey: ['geographic-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geographic_regions')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};
