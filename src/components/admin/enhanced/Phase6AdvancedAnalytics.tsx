import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Zap,
  Shield,
  Database,
  Clock,
  Target
} from 'lucide-react';

const Phase6AdvancedAnalytics = () => {
  // Real-time Analytics Events
  const { data: analyticsEvents } = useQuery({
    queryKey: ['phase6-analytics-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // AI Performance Analytics
  const { data: aiPerformance } = useQuery({
    queryKey: ['phase6-ai-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // AI Performance Metrics
  const { data: aiMetrics } = useQuery({
    queryKey: ['phase6-ai-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Console Errors
  const { data: consoleErrors } = useQuery({
    queryKey: ['phase6-console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Bulk Operations
  const { data: bulkOps } = useQuery({
    queryKey: ['phase6-bulk-operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Calculate real-time metrics
  const totalEvents = analyticsEvents?.length || 0;
  const aiPerformanceAvg = aiPerformance?.length > 0 
    ? aiPerformance.reduce((sum, p) => sum + (p.metric_value || 0), 0) / aiPerformance.length 
    : 0;
  const totalErrors = consoleErrors?.length || 0;
  const activeBulkOps = bulkOps?.filter(op => op.status === 'pending' || op.status === 'running').length || 0;

  // Event type distribution
  const eventTypes = analyticsEvents?.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // AI metrics by type
  const aiMetricTypes = aiMetrics?.reduce((acc, metric) => {
    acc[metric.metric_type] = (acc[metric.metric_type] || 0) + Number(metric.metric_value);
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Phase 6: Advanced Analytics & Performance</h2>
          <p className="text-muted-foreground">Real-time system analytics and performance optimization</p>
        </div>
        <Badge className="bg-green-100 text-green-800">100% Real Data</Badge>
      </div>

      {/* Real-time Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Real-time events tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Performance</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{aiPerformanceAvg.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average AI metric value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
            <p className="text-xs text-muted-foreground">Console errors logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{activeBulkOps}</div>
            <p className="text-xs text-muted-foreground">Bulk operations running</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Events Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Event Types Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(eventTypes).map(([type, count]) => (
              <div key={type} className="p-3 border rounded-lg">
                <div className="text-lg font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {type.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Metrics Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            AI Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(aiMetricTypes).map(([type, value]) => (
              <div key={type} className="p-3 border rounded-lg">
                <div className="text-lg font-bold">{Number(value).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {type.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Analytics Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Recent Analytics Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analyticsEvents?.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{event.event_type}</div>
                    <div className="text-xs text-muted-foreground">{event.page_url}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Errors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              System Errors Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {consoleErrors?.slice(0, 10).map((error) => (
                <div key={error.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{error.error_level}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-48">
                      {error.message}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(error.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Bulk Operations Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bulkOps?.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{operation.operation_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {operation.operation_type} on {operation.target_table}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Processed: {operation.processed_records}/{operation.total_records}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    operation.status === 'completed' ? 'default' :
                    operation.status === 'running' ? 'secondary' :
                    operation.status === 'failed' ? 'destructive' : 
                    'outline'
                  }>
                    {operation.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {new Date(operation.started_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase6AdvancedAnalytics;