
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Brain, TrendingUp, Activity, Zap } from 'lucide-react';

const AdminAIPerformanceTab = () => {
  const { data: performanceMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['ai-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: aiCommands, isLoading: commandsLoading } = useQuery({
    queryKey: ['ai-commands-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: executionLogs, isLoading: executionsLoading } = useQuery({
    queryKey: ['ai-executions-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  const isLoading = metricsLoading || commandsLoading || executionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate performance stats
  const stats = {
    totalMetrics: performanceMetrics?.length || 0,
    activeCommands: aiCommands?.length || 0,
    recentExecutions: executionLogs?.length || 0,
    avgPerformance: performanceMetrics?.reduce((sum, m) => sum + m.metric_value, 0) / (performanceMetrics?.length || 1) || 0
  };

  // Prepare chart data
  const chartData = performanceMetrics?.slice(0, 10).map(metric => ({
    name: metric.metric_name.substring(0, 10),
    value: metric.metric_value,
    type: metric.metric_type
  })) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Total Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalMetrics}</div>
            <Badge className="bg-blue-100 text-blue-800 mt-1">Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Active Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCommands}</div>
            <Badge className="bg-green-100 text-green-800 mt-1">Running</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.recentExecutions}</div>
            <Badge className="bg-purple-100 text-purple-800 mt-1">Monitored</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Avg Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(stats.avgPerformance * 100).toFixed(1)}%
            </div>
            <Badge className="bg-orange-100 text-orange-800 mt-1">Optimized</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics?.slice(0, 10).map((metric) => (
              <div key={metric.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{metric.metric_name}</h4>
                  <p className="text-sm text-gray-600">
                    Type: {metric.metric_type} • {new Date(metric.recorded_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {(metric.metric_value * 100).toFixed(1)}%
                  </div>
                  {metric.related_id && (
                    <p className="text-xs text-gray-500">ID: {metric.related_id}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Command Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {executionLogs?.slice(0, 10).map((execution) => (
              <div key={execution.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">Command Execution</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(execution.created_at).toLocaleDateString()} • 
                    {execution.execution_time_ms ? ` ${execution.execution_time_ms}ms` : ' Processing...'}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(execution.execution_status)}
                  {execution.error_message && (
                    <p className="text-xs text-red-500 mt-1">Error occurred</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAIPerformanceTab;
