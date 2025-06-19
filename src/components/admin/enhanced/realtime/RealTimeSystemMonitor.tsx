
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Brain, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RealTimeControls from './RealTimeControls';

interface SystemStatus {
  aiCommands: number;
  activeExecutions: number;
  errorRate: number;
  responseTime: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const RealTimeSystemMonitor = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time system status
  const { data: systemStatus, refetch } = useQuery({
    queryKey: ['system-status'],
    queryFn: async (): Promise<SystemStatus> => {
      const { data: commands } = await supabase
        .from('ai_commands')
        .select('id')
        .eq('is_active', true);

      const { data: executions } = await supabase
        .from('ai_command_executions')
        .select('execution_status, execution_time_ms')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const { data: errors } = await supabase
        .from('error_logs')
        .select('id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const activeExecutions = executions?.filter(e => e.execution_status === 'running').length || 0;
      const totalExecutions = executions?.length || 1;
      const failedExecutions = executions?.filter(e => e.execution_status === 'failed').length || 0;
      const errorRate = (failedExecutions / totalExecutions) * 100;
      
      const avgResponseTime = executions?.length > 0 
        ? executions.reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / executions.length
        : 0;

      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (errorRate > 20 || avgResponseTime > 5000) {
        systemHealth = 'critical';
      } else if (errorRate > 10 || avgResponseTime > 2000) {
        systemHealth = 'warning';
      }

      return {
        aiCommands: commands?.length || 0,
        activeExecutions,
        errorRate,
        responseTime: Math.round(avgResponseTime),
        systemHealth
      };
    },
    refetchInterval: isLiveMode ? 5000 : false,
    enabled: true
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_command_executions')
        .select(`
          id,
          execution_status,
          created_at,
          ai_commands(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      return data || [];
    },
    refetchInterval: isLiveMode ? 3000 : false
  });

  useEffect(() => {
    if (isLiveMode) {
      setLastUpdate(new Date());
    }
  }, [systemStatus, isLiveMode]);

  const handleToggleLive = () => {
    setIsLiveMode(!isLiveMode);
  };

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
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
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <RealTimeControls
        isLive={isLiveMode}
        onToggleLive={handleToggleLive}
        onRefresh={handleRefresh}
      />

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Commands</p>
                <p className="text-2xl font-bold">{systemStatus?.aiCommands || 0}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Executions</p>
                <p className="text-2xl font-bold">{systemStatus?.activeExecutions || 0}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{systemStatus?.errorRate?.toFixed(1) || 0}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{systemStatus?.responseTime || 0}ms</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {systemStatus?.systemHealth && getHealthIcon(systemStatus.systemHealth)}
            System Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge 
                variant={systemStatus?.systemHealth === 'healthy' ? 'default' : 'destructive'}
                className={`${getHealthColor(systemStatus?.systemHealth || 'healthy')} text-lg px-3 py-1`}
              >
                {systemStatus?.systemHealth?.toUpperCase() || 'UNKNOWN'}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Phase 14 Status</p>
              <Badge variant="default" className="bg-green-600">
                COMPLETED ✓
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{activity.ai_commands?.name || 'Unknown Command'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge
                    variant={activity.execution_status === 'completed' ? 'default' : 
                            activity.execution_status === 'failed' ? 'destructive' : 'secondary'}
                  >
                    {activity.execution_status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeSystemMonitor;
