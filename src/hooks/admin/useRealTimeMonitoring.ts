
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeMetrics {
  activeUsers: number;
  systemLoad: number;
  errorRate: number;
  responseTime: number;
  throughput: number;
  lastUpdated: Date;
}

export const useRealTimeMonitoring = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    systemLoad: 0,
    errorRate: 0,
    responseTime: 0,
    throughput: 0,
    lastUpdated: new Date()
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Get active users
        const { data: activeUsers } = await supabase
          .from('profiles')
          .select('id')
          .gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());

        // Get error rate
        const { data: recentErrors } = await supabase
          .from('error_logs')
          .select('id')
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

        // Get performance metrics
        const { data: perfMetrics } = await supabase
          .from('performance_metrics')
          .select('load_time_ms')
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .limit(100);

        const avgResponseTime = perfMetrics?.length 
          ? perfMetrics.reduce((sum, metric) => sum + metric.load_time_ms, 0) / perfMetrics.length
          : 0;

        setMetrics({
          activeUsers: activeUsers?.length || 0,
          systemLoad: Math.random() * 30 + 20, // Simulated for now
          errorRate: (recentErrors?.length || 0) / 100, // Percentage
          responseTime: avgResponseTime,
          throughput: Math.random() * 100 + 200, // Simulated
          lastUpdated: new Date()
        });

        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch real-time metrics:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up real-time updates
    const interval = setInterval(fetchMetrics, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, isConnected };
};
