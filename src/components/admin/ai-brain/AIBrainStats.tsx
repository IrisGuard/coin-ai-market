
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AIBrainMetrics {
  activeCommands: number;
  executionsToday: number;
  averageExecutionTime: number;
  successRate: number;
  errorCount: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const AIBrainStats = () => {
  // Real-time AI Brain metrics from database
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['ai-brain-stats'],
    queryFn: async (): Promise<AIBrainMetrics> => {
      // Get active commands count
      const { data: activeCommands } = await supabase
        .from('ai_commands')
        .select('id')
        .eq('is_active', true);

      // Get executions from last 24 hours
      const { data: executions } = await supabase
        .from('ai_command_executions')
        .select('execution_time_ms, execution_status')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get recent performance metrics
      const { data: performanceMetrics } = await supabase
        .from('ai_performance_metrics')
        .select('metric_value, metric_name')
        .eq('metric_type', 'execution_time')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Calculate real metrics
      const totalExecutions = executions?.length || 0;
      const successfulExecutions = executions?.filter(e => e.execution_status === 'completed').length || 0;
      const failedExecutions = executions?.filter(e => e.execution_status === 'failed').length || 0;
      
      const avgExecutionTime = executions?.length > 0 
        ? executions.reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / executions.length
        : 0;

      const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100;

      // Determine system health
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (failedExecutions > 5 || successRate < 80) {
        systemHealth = 'critical';
      } else if (failedExecutions > 2 || successRate < 90) {
        systemHealth = 'warning';
      }

      return {
        activeCommands: activeCommands?.length || 0,
        executionsToday: totalExecutions,
        averageExecutionTime: Math.round(avgExecutionTime),
        successRate: Math.round(successRate),
        errorCount: failedExecutions,
        systemHealth
      };
    },
    refetchInterval: 10000 // Refresh every 10 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Active Commands */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Commands</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.activeCommands || 0}</div>
          <p className="text-xs text-muted-foreground">Ready for execution</p>
        </CardContent>
      </Card>

      {/* Executions Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Executions (24h)</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.executionsToday || 0}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {metrics?.averageExecutionTime || 0}ms
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{metrics?.successRate || 0}%</div>
            {metrics?.systemHealth && getHealthIcon(metrics.systemHealth)}
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={metrics?.systemHealth === 'healthy' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {metrics?.systemHealth || 'unknown'}
            </Badge>
            {metrics?.errorCount > 0 && (
              <span className="text-xs text-red-600">
                {metrics.errorCount} errors
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainStats;
