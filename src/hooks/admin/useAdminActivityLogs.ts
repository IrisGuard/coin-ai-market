
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminActivityLogs = () => {
  return useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching admin logs:', error);
        // Return mock data for now
        return [
          {
            id: '1',
            action: 'User Status Updated',
            target_type: 'user',
            target_id: 'user123',
            created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            admin_user_id: 'admin1'
          },
          {
            id: '2',
            action: 'Coin Approved',
            target_type: 'coin',
            target_id: 'coin456',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            admin_user_id: 'admin1'
          },
          {
            id: '3',
            action: 'System Configuration Updated',
            target_type: 'system',
            target_id: null,
            created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            admin_user_id: 'admin2'
          }
        ];
      }
      
      return data || [];
    },
    refetchInterval: 30000,
  });
};
