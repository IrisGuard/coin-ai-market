
import { useQuery } from '@tanstack/react-query';
import { getOptimizedDashboardStats, validateSecurityStatus } from '@/utils/optimizedAdminHelpers';

export const useComprehensiveAdminData = () => {
  return useQuery({
    queryKey: ['comprehensive-admin-dashboard'],
    queryFn: getOptimizedDashboardStats,
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

export const useSecurityValidation = () => {
  return useQuery({
    queryKey: ['security-validation'],
    queryFn: validateSecurityStatus,
    refetchInterval: 60000, // Check every minute
    enabled: true
  });
};
