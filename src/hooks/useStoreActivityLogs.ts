
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface StoreActivityLog {
  id: string;
  store_id: string;
  activity_type: string;
  activity_description: string;
  activity_data: Record<string, any>;
  performed_by: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  severity_level: 'info' | 'warning' | 'error' | 'critical';
  source_component: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  profiles?: {
    full_name: string;
    email: string;
  };
}

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

// Get store activity logs with filtering and pagination
export const useStoreActivityLogs = (
  storeId?: string,
  filters?: {
    activityType?: string;
    severityLevel?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }
) => {
  return useQuery({
    queryKey: ['store-activity-logs', storeId, filters],
    queryFn: async () => {
      if (!storeId) return [];

      let query = supabase
        .from('store_activity_logs')
        .select(`
          *,
          profiles:performed_by (
            full_name,
            email
          )
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.activityType) {
        query = query.eq('activity_type', filters.activityType);
      }
      
      if (filters?.severityLevel) {
        query = query.eq('severity_level', filters.severityLevel);
      }
      
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as StoreActivityLog[];
    },
    enabled: !!storeId,
  });
};

// Get store activity statistics
export const useStoreActivityStats = (storeId?: string, days: number = 30) => {
  return useQuery({
    queryKey: ['store-activity-stats', storeId, days],
    queryFn: async () => {
      if (!storeId) return null;

      const { data, error } = await supabase.rpc('get_store_activity_stats', {
        p_store_id: storeId,
        p_days: days
      });

      if (error) throw error;
      return data as StoreActivityStats;
    },
    enabled: !!storeId,
  });
};

// Log store activity
export const useLogStoreActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      storeId,
      activityType,
      activityDescription,
      activityData = {},
      severityLevel = 'info',
      sourceComponent = 'frontend',
      relatedEntityType,
      relatedEntityId
    }: {
      storeId: string;
      activityType: string;
      activityDescription: string;
      activityData?: Record<string, any>;
      severityLevel?: 'info' | 'warning' | 'error' | 'critical';
      sourceComponent?: string;
      relatedEntityType?: string;
      relatedEntityId?: string;
    }) => {
      const { data, error } = await supabase.rpc('log_store_activity', {
        p_store_id: storeId,
        p_activity_type: activityType,
        p_activity_description: activityDescription,
        p_activity_data: activityData,
        p_severity_level: severityLevel,
        p_source_component: sourceComponent,
        p_related_entity_type: relatedEntityType,
        p_related_entity_id: relatedEntityId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['store-activity-logs', variables.storeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['store-activity-stats', variables.storeId] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error logging activity",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Get all store activity types for filtering
export const useStoreActivityTypes = (storeId?: string) => {
  return useQuery({
    queryKey: ['store-activity-types', storeId],
    queryFn: async () => {
      if (!storeId) return [];

      const { data, error } = await supabase
        .from('store_activity_logs')
        .select('activity_type')
        .eq('store_id', storeId)
        .distinct();

      if (error) throw error;
      return data.map(item => item.activity_type);
    },
    enabled: !!storeId,
  });
};

// Bulk delete activity logs (admin only)
export const useBulkDeleteActivityLogs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      logIds, 
      storeId 
    }: { 
      logIds: string[]; 
      storeId: string; 
    }) => {
      const { error } = await supabase
        .from('store_activity_logs')
        .delete()
        .in('id', logIds)
        .eq('store_id', storeId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['store-activity-logs', variables.storeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['store-activity-stats', variables.storeId] 
      });
      
      toast({
        title: "Success",
        description: "Activity logs deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
