
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getOptimizedDashboardStats } from '@/utils/optimizedAdminHelpers';

export const useOptimizedDashboardStats = () => {
  return useQuery({
    queryKey: ['optimized-admin-dashboard'],
    queryFn: async () => {
      console.log('🚀 Fetching optimized dashboard stats...');
      
      try {
        // Use the new optimized function
        const { data, error } = await supabase.rpc('check_optimization_performance');
        
        if (error) {
          console.error('❌ Error fetching optimization performance:', error);
          // Fallback to regular dashboard stats
          return await getOptimizedDashboardStats();
        }

        console.log('✅ Optimization performance result:', data);
        
        // Get the actual dashboard data
        const dashboardData = await getOptimizedDashboardStats();
        
        // Safe spreading with null check
        if (dashboardData && typeof dashboardData === 'object') {
          return {
            ...dashboardData,
            optimization_metrics: data
          };
        }
        
        return {
          optimization_metrics: data,
          users: { total: 0, dealers: 0, verified_dealers: 0 },
          coins: { total: 0, featured: 0, live_auctions: 0 },
          transactions: { completed: 0, revenue: 0 },
          system: { errors_24h: 0, ai_commands: 0 }
        };
      } catch (error) {
        console.error('❌ Failed to fetch optimized dashboard:', error);
        // Fallback to regular dashboard stats
        return await getOptimizedDashboardStats();
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.message?.includes('permission') || error?.message?.includes('denied')) {
        console.error('🚫 Permission denied - check admin access');
        return false;
      }
      return failureCount < 2;
    }
  });
};

export const usePerformanceMonitoring = () => {
  return useQuery({
    queryKey: ['performance-monitoring'],
    queryFn: async () => {
      console.log('📊 Checking performance metrics...');
      
      const { data, error } = await supabase.rpc('check_optimization_performance');
      
      if (error) {
        console.error('❌ Performance check failed:', error);
        throw error;
      }
      
      console.log('📈 Performance metrics:', data);
      return data;
    },
    refetchInterval: 10000, // Check every 10 seconds for real-time monitoring
    enabled: true
  });
};
