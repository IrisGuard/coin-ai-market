
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCoinAnalytics = () => {
  return useQuery({
    queryKey: ['coin-analytics'],
    queryFn: async () => {
      const [totalResult, pendingResult, verifiedResult, featuredResult, rejectedResult] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('authentication_status', 'pending'),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('authentication_status', 'verified'),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('authentication_status', 'rejected')
      ]);

      return {
        totals: {
          total: totalResult.count || 0,
          pending: pendingResult.count || 0,
          verified: verifiedResult.count || 0,
          featured: featuredResult.count || 0,
          rejected: rejectedResult.count || 0
        }
      };
    },
  });
};
