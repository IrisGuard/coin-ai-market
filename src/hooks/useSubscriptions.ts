import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { logError } from '@/utils/errorHandler';

export const useSubscriptions = (userId?: string) => {
  return useQuery({
    queryKey: ['subscriptions', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        logError(error as Error, 'Failed to fetch subscriptions');
        throw error;
      }
    },
    enabled: !!userId,
  });
}; 