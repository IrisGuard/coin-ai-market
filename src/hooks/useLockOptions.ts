
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLockOptions = () => {
  return useQuery({
    queryKey: ['lock-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lock_options')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};
