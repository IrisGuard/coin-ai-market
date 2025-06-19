import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { monitoringService } from '@/services/monitoringService';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  overallHealth: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  activeAlerts: number;
  criticalAlerts: number;
  errorRate: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export const useRealTimeSystemStatus = (refreshInterval: number = 30000) => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);

  // Real-time system status query
  const { data: systemStatus, isLoading, error, refetch } = useQuery({
    queryKey: ['real-time-system-status'],
    queryFn: async (): Promise<SystemStatus> => {
      // Perform health check
      const healthChecks = await monitoringService.performSystemHealthCheck();
      
      // Get active alerts
      const activeAlerts = await monitoringService.getActiveAlerts();
      const criticalAlerts = activeAlerts?.filter(alert => alert.severity === 'critical') || [];
      
      // Get uptime stats for main services
      const uptimeStats = await monitoringService.getUptimeStats('main_application', 24);
      
      // Get recent system health metrics
      const recentMetrics = await monitoringService.getSystemHealthMetrics(60);
      
      // Calculate overall health status
      const hasCritical = healthChecks.some(check => check.status === 'critical') || criticalAlerts.length > 0;
      const hasWarning = healthChecks.some(check => check.status === 'warning');
      
      const overallHealth = hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy';
      
      // Calculate resource usage from recent metrics
      const cpuMetric = recentMetrics?.find(m => m.metric_name === 'cpu_usage');
      const memoryMetric = recentMetrics?.find(m => m.metric_name === 'memory_usage');
      const diskMetric = recentMetrics?.find(m => m.metric_name === 'disk_usage');
      
      // Get error rate from recent errors
      const { data: recentErrors } = await supabase
        .from('error_logs')
        .select('id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
      
      setLastHealthCheck(new Date());
      
      return {
        overallHealth,
        uptime: uptimeStats.uptime,
        responseTime: uptimeStats.avgResponseTime,
        activeAlerts: activeAlerts?.length || 0,
        criticalAlerts: criticalAlerts.length,
        errorRate: recentErrors?.length || 0,
        resourceUsage: {
          cpu: cpuMetric?.metric_value || 0,
          memory: memoryMetric?.metric_value || 0,
          disk: diskMetric?.metric_value || 0
        }
      };
    },
    refetchInterval: isMonitoring ? refreshInterval : false,
    enabled: isMonitoring
  });

  // Auto-escalation check
  useEffect(() => {
    if (isMonitoring) {
      const escalationInterval = setInterval(() => {
        monitoringService.checkAndEscalateAlerts();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(escalationInterval);
    }
  }, [isMonitoring]);

  // Resource usage logging
  const logCurrentResourceUsage = useCallback(async () => {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      await monitoringService.logResourceUsage({
        resource_type: 'memory',
        usage_percentage: memoryUsagePercent,
        absolute_value: memory.usedJSHeapSize,
        unit: 'bytes',
        recorded_at: new Date().toISOString()
      });
    }
  }, []);

  // Trigger manual health check
  const triggerHealthCheck = useCallback(async () => {
    await monitoringService.performSystemHealthCheck();
    await logCurrentResourceUsage();
    refetch();
  }, [refetch, logCurrentResourceUsage]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
  }, []);

  // Create alert manually
  const createAlert = useCallback(async (
    type: 'performance' | 'error' | 'security' | 'uptime',
    severity: 'low' | 'medium' | 'high' | 'critical',
    title: string,
    description: string
  ) => {
    await monitoringService.createAlert({
      alert_type: type,
      severity,
      title,
      description
    });
    refetch();
  }, [refetch]);

  return {
    systemStatus,
    isLoading,
    error,
    isMonitoring,
    lastHealthCheck,
    triggerHealthCheck,
    toggleMonitoring,
    createAlert,
    refetch
  };
};
