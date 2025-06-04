import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { logError } from '@/utils/errorHandler';

export const useCoinDataValidation = () => {
  return useQuery({
    queryKey: ['coin-data-validation'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coins')
          .select('*')
          .limit(10);
        
        if (error) throw error;
        return data;
      } catch (error) {
        logError(error as Error, 'Failed to validate coin data');
        throw error;
      }
    },
  });
}; 