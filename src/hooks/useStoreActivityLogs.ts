
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StoreActivityStats {
  total_activities: number;
  severity_breakdown: {
    critical: number;
    error: number;
    warning: number;
    info: number;
  };
  unique_activity_types: number;
  unique_users: number;
  first_activity: string | null;
  last_activity: string | null;
  top_activities: Array<{
    activity_type: string;
    count: number;
  }>;
  period_days: number;
  generated_at: string;
}

export const useStoreActivityLogs = (storeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['store-activity-logs', storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_activity_logs')
        .select(`
          *,
          profiles:performed_by(full_name, email)
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching store activity logs:', error);
        throw error;
      }

      return data || [];
    },
    enabled: enabled && !!storeId
  });
};

export const useStoreActivityStats = (storeId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['store-activity-stats', storeId, days],
    queryFn: async (): Promise<StoreActivityStats> => {
      const { data, error } = await supabase
        .rpc('get_store_activity_stats', {
          p_store_id: storeId,
          p_days: days
        });

      if (error) {
        console.error('Error fetching store activity stats:', error);
        throw error;
      }

      // Safe parsing of the function result
      if (data && typeof data === 'object') {
        return data as StoreActivityStats;
      }

      // Fallback stats if function fails
      return {
        total_activities: 0,
        severity_breakdown: {
          critical: 0,
          error: 0,
          warning: 0,
          info: 0
        },
        unique_activity_types: 0,
        unique_users: 0,
        first_activity: null,
        last_activity: null,
        top_activities: [],
        period_days: days,
        generated_at: new Date().toISOString()
      };
    },
    enabled: !!storeId
  });
};

export const useLogStoreActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      storeId: string;
      activityType: string;
      description: string;
      data?: any;
      severity?: string;
    }) => {
      const { data, error } = await supabase
        .rpc('log_store_activity', {
          p_store_id: params.storeId,
          p_activity_type: params.activityType,
          p_activity_description: params.description,
          p_activity_data: params.data || {},
          p_severity_level: params.severity || 'info'
        });

      if (error) {
        console.error('Error logging store activity:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['store-activity-logs', variables.storeId]
      });
      queryClient.invalidateQueries({
        queryKey: ['store-activity-stats', variables.storeId]
      });
    }
  });
};

export const useStoreUsers = (storeId: string) => {
  return useQuery({
    queryKey: ['store-users', storeId],
    queryFn: async () => {
      // Get unique users from admin activity logs
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('admin_user_id')
        .eq('target_id', storeId)
        .eq('target_type', 'stores');

      if (error) {
        console.error('Error fetching store users:', error);
        return [];
      }

      // Get unique user IDs
      const uniqueUserIds = [...new Set(data.map(log => log.admin_user_id))];
      
      if (uniqueUserIds.length === 0) {
        return [];
      }

      // Fetch user details
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', uniqueUserIds);

      if (usersError) {
        console.error('Error fetching user details:', usersError);
        return [];
      }

      return users || [];
    },
    enabled: !!storeId
  });
};
