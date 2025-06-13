
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RealTimeControls from './realtime/RealTimeControls';
import RealTimeMetricsGrid from './realtime/RealTimeMetricsGrid';
import PerformanceOverview from './realtime/PerformanceOverview';
import { RealTimeMetrics, DashboardStats } from './realtime/types';

const RealTimeAdminDashboard = () => {
  const [isLive, setIsLive] = useState(false);
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    active_users: 0,
    active_sessions: 0,
    pending_transactions: 0,
    system_alerts: 0,
    performance_score: 95,
    last_updated: new Date().toISOString()
  });

  const { data: dashboardData, refetch } = useQuery({
    queryKey: ['real-time-admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      return data as unknown as DashboardStats;
    },
    refetchInterval: isLive ? 5000 : false,
    enabled: isLive
  });

  useEffect(() => {
    if (dashboardData) {
      setMetrics({
        active_users: dashboardData.active_users || 0,
        active_sessions: Math.floor(dashboardData.active_users * 1.2) || 0,
        pending_transactions: Math.floor(dashboardData.total_transactions * 0.1) || 0,
        system_alerts: dashboardData.errors_24h || 0,
        performance_score: dashboardData.errors_24h > 5 ? 75 : 95,
        last_updated: new Date().toISOString()
      });
    }
  }, [dashboardData]);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
    if (!isLive) {
      refetch();
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <RealTimeControls 
        isLive={isLive}
        onToggleLive={toggleLiveMode}
        onRefresh={handleRefresh}
      />
      
      <RealTimeMetricsGrid 
        metrics={metrics}
        isLive={isLive}
      />
      
      <PerformanceOverview 
        metrics={metrics}
        isLive={isLive}
      />
    </div>
  );
};

export default RealTimeAdminDashboard;
