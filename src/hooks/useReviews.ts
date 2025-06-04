import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { logError } from '@/utils/errorHandler';

export const useReviews = (coinId?: string) => {
  return useQuery({
    queryKey: ['reviews', coinId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('bids')
          .select('*')
          .eq('coin_id', coinId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        logError(error as Error, 'Failed to fetch reviews');
        throw error;
      }
    },
    enabled: !!coinId,
  });
}; 