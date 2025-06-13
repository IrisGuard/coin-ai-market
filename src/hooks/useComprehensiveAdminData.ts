
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useComprehensiveAdminData = () => {
  return useQuery({
    queryKey: ['comprehensive-admin-data'],
    queryFn: async () => {
      try {
        // Use the optimized admin dashboard function
        const { data, error } = await supabase.rpc('get_admin_dashboard_comprehensive');
        
        if (error) {
          console.error('❌ Error fetching comprehensive admin data:', error);
          throw error;
        }
        
        console.log('✅ Comprehensive admin data loaded:', data);
        return data;
      } catch (error) {
        console.error('❌ Failed to fetch comprehensive admin data:', error);
        
        // Fallback to individual queries if the function fails
        const [usersResult, coinsResult, systemResult] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('coins').select('*', { count: 'exact', head: true }),
          supabase.from('ai_commands').select('*', { count: 'exact', head: true })
        ]);

        return {
          users: { total: usersResult.count || 0 },
          coins: { total: coinsResult.count || 0 },
          system: { ai_commands: systemResult.count || 0 }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
};
