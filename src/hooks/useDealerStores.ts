
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DealerStore {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  rating?: number;
  verified_dealer?: boolean;
  created_at?: string;
}

export const useDealerStores = () => {
  return useQuery({
    queryKey: ['dealer-stores'],
    queryFn: async (): Promise<DealerStore[]> => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verified_dealer', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dealer stores:', error);
        return [];
      }

      return profiles || [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
