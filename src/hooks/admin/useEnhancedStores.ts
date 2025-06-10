
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      // Since store_activity_logs table doesn't exist, return mock data
      const mockLogs = [
        {
          id: '1',
          activity_type: 'listing_created',
          activity_data: { item: 'New coin listing' },
          created_at: new Date().toISOString(),
          stores: {
            name: 'Mock Store',
            user_id: 'mock-user-id'
          }
        }
      ];
      
      return storeId ? mockLogs.filter(log => log.stores.name.includes('Mock')) : mockLogs;
    },
    enabled: !storeId || !!storeId,
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
      activityData 
    }: { 
      storeId: string; 
      activityType: string; 
      activityData?: any 
    }) => {
      // Since store_activity_logs table doesn't exist, just log to console
      console.log('Store activity:', { storeId, activityType, activityData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-activity-logs'] });
    },
  });
};

export const useBulkStoreOperations = () => {
  const queryClient = useQueryClient();
  
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
      
      // Log the operation (since we don't have store_activity_logs table)
      console.log('Bulk operation performed:', { storeIds, operation, value });
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
