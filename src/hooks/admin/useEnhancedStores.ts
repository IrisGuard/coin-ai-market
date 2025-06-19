
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLogStoreActivity } from '@/hooks/useStoreActivityLogs';

export const useEnhancedStoreData = () => {
  return useQuery({
    queryKey: ['enhanced-store-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          profiles!stores_user_id_fkey (
            id,
            full_name,
            email,
            avatar_url,
            verified_dealer,
            rating
          ),
          coins (
            id,
            name,
            price,
            sold,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useStoreActivityLogs = (storeId?: string) => {
  return useQuery({
    queryKey: ['store-activity-logs', storeId],
    queryFn: async () => {
      if (!storeId) return [];

      const { data, error } = await supabase
        .from('store_activity_logs')
        .select(`
          *,
          profiles:performed_by (
            full_name,
            email
          )
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });
};

export const useStorePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['store-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          verified,
          is_active,
          created_at,
          coins!inner (
            id,
            price,
            sold,
            created_at,
            views
          )
        `);
      
      if (error) throw error;
      
      // Calculate performance metrics
      const metrics = data?.map(store => {
        const coins = store.coins || [];
        const totalListings = coins.length;
        const soldCoins = coins.filter(coin => coin.sold);
        const totalRevenue = soldCoins.reduce((sum, coin) => sum + (coin.price || 0), 0);
        const totalViews = coins.reduce((sum, coin) => sum + (coin.views || 0), 0);
        const avgPrice = totalListings > 0 ? coins.reduce((sum, coin) => sum + (coin.price || 0), 0) / totalListings : 0;
        
        return {
          store_id: store.id,
          store_name: store.name,
          verified: store.verified,
          is_active: store.is_active,
          total_listings: totalListings,
          sold_items: soldCoins.length,
          total_revenue: totalRevenue,
          total_views: totalViews,
          avg_price: avgPrice,
          conversion_rate: totalListings > 0 ? (soldCoins.length / totalListings) * 100 : 0,
          created_at: store.created_at
        };
      }) || [];
      
      return metrics;
    },
  });
};

export const useLogStoreActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      storeId, 
      activityType, 
      activityDescription,
      activityData = {},
      severityLevel = 'info',
      sourceComponent = 'admin_panel',
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
      queryClient.invalidateQueries({ queryKey: ['store-activity-logs', variables.storeId] });
    },
  });
};

export const useBulkStoreOperations = () => {
  const queryClient = useQueryClient();
  const logActivity = useLogStoreActivity();
  
  return useMutation({
    mutationFn: async ({ 
      storeIds, 
      operation, 
      value 
    }: { 
      storeIds: string[]; 
      operation: 'verify' | 'activate' | 'deactivate'; 
      value?: boolean 
    }) => {
      const updateData = operation === 'verify' 
        ? { verified: value } 
        : { is_active: value };
      
      const { error } = await supabase
        .from('stores')
        .update(updateData)
        .in('id', storeIds);
      
      if (error) throw error;
      
      // Log activity for each store
      for (const storeId of storeIds) {
        await logActivity.mutateAsync({
          storeId,
          activityType: 'bulk_operation',
          activityDescription: `Bulk ${operation} operation performed`,
          activityData: { 
            operation, 
            value, 
            affected_stores: storeIds.length 
          },
          severityLevel: 'info',
          sourceComponent: 'admin_bulk_operations'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-store-data'] });
      queryClient.invalidateQueries({ queryKey: ['store-activity-logs'] });
      toast({
        title: "Success",
        description: "Bulk operation completed successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    },
  });
};
