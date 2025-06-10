
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useConsoleErrors = () => {
  return useQuery({
    queryKey: ['console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });
};

export const useConsoleErrorsByLevel = (level?: string) => {
  return useQuery({
    queryKey: ['console-errors-by-level', level],
    queryFn: async () => {
      let query = supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false });

      if (level) {
        query = query.eq('error_level', level);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!level,
  });
};
