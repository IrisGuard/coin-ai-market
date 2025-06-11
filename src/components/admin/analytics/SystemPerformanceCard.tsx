
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemPerformanceCardProps {
  analyticsDataRaw?: any;
}

const SystemPerformanceCard: React.FC<SystemPerformanceCardProps> = () => {
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['system-performance'],
    queryFn: async () => {
      // Get error count from last hour
      const { data: errors } = await supabase
        .from('error_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      // Get performance metrics if available
      const { data: metrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const avgLoadTime = metrics?.length 
        ? metrics.reduce((sum, metric) => sum + metric.load_time_ms, 0) / metrics.length
        : 250;

      return {
        avg_response_time: avgLoadTime,
        errors_last_hour: errors?.length || 0,
        active_sessions: 0, // Would need session tracking
        critical_alerts: 0,
        system_health: errors?.length > 10 ? 'critical' : errors?.length > 5 ? 'warning' : 'healthy'
      };
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = performanceData || {
    avg_response_time: 0,
    errors_last_hour: 0,
    active_sessions: 0,
    critical_alerts: 0,
    system_health: 'healthy'
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Avg Response Time</span>
            </div>
            <span className="font-semibold">{Math.round(data.avg_response_time)}ms</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Errors (Last Hour)</span>
            </div>
            <span className="font-semibold">{data.errors_last_hour}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Active Sessions</span>
            </div>
            <span className="font-semibold">{data.active_sessions}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getHealthIcon(data.system_health)}
              <span className="text-sm">System Health</span>
            </div>
            <span className={`font-semibold capitalize ${getHealthColor(data.system_health)}`}>
              {data.system_health}
            </span>
          </div>

          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPerformanceCard;
