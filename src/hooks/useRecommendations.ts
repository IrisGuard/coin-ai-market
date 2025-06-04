import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { logError } from '@/utils/errorHandler';

export const useRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coins')
          .select('*')
          .limit(5);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        logError(error as Error, 'Failed to fetch recommendations');
        throw error;
      }
    },
    enabled: !!userId,
  });
}; 