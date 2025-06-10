
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSystemHealth } from './useSystemHealth';
import { useRealTimeMetrics } from './useRealTimeMonitoring';

interface EnhancedRealTimeData {
  systemHealth: any;
  monitoring: any;
  dashboardStats: any;
  securityStatus: any;
  isLoading: boolean;
  error: string | null;
}

export const useEnhancedRealTimeData = () => {
  const [data, setData] = useState<EnhancedRealTimeData>({
    systemHealth: null,
    monitoring: null,
    dashboardStats: null,
    securityStatus: null,
    isLoading: true,
    error: null
  });

  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { metrics, isConnected } = useRealTimeMetrics();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Get comprehensive dashboard statistics
        const { data: stats, error } = await supabase.rpc('get_dashboard_stats');
        
        if (error) throw error;

        // Get security audit results
        const { data: securityAudit, error: securityError } = await supabase.rpc('audit_security_configuration');
        
        if (securityError) throw securityError;

        // Aggregate all data
        const enhancedData = {
          systemHealth: health,
          monitoring: { metrics, isConnected },
          dashboardStats: stats,
          securityStatus: securityAudit,
          isLoading: false,
          error: null
        };

        setData(enhancedData);
      } catch (error) {
        console.error('Failed to fetch enhanced real-time data:', error);
        setData(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false
        }));
      }
    };

    if (!healthLoading) {
      fetchDashboardStats();
      
      // Set up real-time updates every 30 seconds
      const interval = setInterval(fetchDashboardStats, 30000);
      
      return () => clearInterval(interval);
    }
  }, [health, metrics, isConnected, healthLoading]);

  return data;
};
