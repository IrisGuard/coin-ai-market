
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { verifyOptimizedAdminAccess, optimizedSafeQuery } from '@/utils/optimizedAdminHelpers';

// Optimized Admin Users Hook with enhanced performance
export const useOptimizedAdminUsers = () => {
  return useQuery({
    queryKey: ['optimized-admin-users'],
    queryFn: async () => {
      // Use the optimized admin verification
      const isAdmin = await verifyOptimizedAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return optimizedSafeQuery(async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('✅ Optimized admin users loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    },
    staleTime: 30000, // Cache for 30 seconds for better performance
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Admin access required')) {
        return false;
      }
      return failureCount < 2;
    }
  });
};

// Optimized Admin Coins Hook
export const useOptimizedAdminCoins = () => {
  return useQuery({
    queryKey: ['optimized-admin-coins'],
    queryFn: async () => {
      const isAdmin = await verifyOptimizedAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      return optimizedSafeQuery(async () => {
        const { data, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles!coins_user_id_fkey (
              id,
              name,
              email
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        console.log('✅ Optimized admin coins loaded:', data?.length || 0);
        return { data: data || [], error: null };
      });
    },
    staleTime: 15000, // Cache for 15 seconds
  });
};

// Optimized Dashboard Stats Hook
export const useOptimizedDashboardStats = () => {
  return useQuery({
    queryKey: ['optimized-dashboard-stats'],
    queryFn: async () => {
      const isAdmin = await verifyOptimizedAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase.rpc('get_admin_dashboard_optimized');
      
      if (error) {
        console.error('Dashboard stats error:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 60000, // Cache dashboard stats for 1 minute
    refetchInterval: 300000, // Auto-refresh every 5 minutes
  });
};

// Optimized mutation with enhanced error handling
export const useOptimizedUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const isAdmin = await verifyOptimizedAdminAccess();
      if (!isAdmin) {
        throw new Error('Admin access required');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ verified_dealer: verified })
        .eq('id', userId);
      
      if (error) {
        throw new Error(error.message || 'Failed to update user status');
      }
    },
    onSuccess: () => {
      // Invalidate all relevant queries for immediate updates
      queryClient.invalidateQueries({ queryKey: ['optimized-admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      toast({
        title: "User Updated",
        description: "User status updated successfully with optimized performance.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};
