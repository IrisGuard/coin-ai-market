import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Target,
  Settings,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const Phase6PerformanceEngine = () => {
  // Data Quality Reports
  const { data: dataQuality } = useQuery({
    queryKey: ['phase6-data-quality'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_quality_reports')
        .select('*')
        .order('report_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000
  });

  // AI Performance Analytics with command context
  const { data: aiAnalytics } = useQuery({
    queryKey: ['phase6-ai-analytics-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // AI Command Execution Logs
  const { data: executionLogs } = useQuery({
    queryKey: ['phase6-execution-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_execution_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Automation Rules Performance
  const { data: automationRules } = useQuery({
    queryKey: ['phase6-automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .order('last_executed', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Calculate performance metrics
  const avgExecutionTime = executionLogs?.length > 0 
    ? executionLogs.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / executionLogs.length 
    : 0;

  const successRate = executionLogs?.length > 0 
    ? (executionLogs.filter(log => log.success).length / executionLogs.length) * 100 
    : 0;

  const avgQualityScore = dataQuality?.length > 0 
    ? dataQuality.reduce((sum, report) => sum + Number(report.quality_score), 0) / dataQuality.length 
    : 0;

  const totalCost = executionLogs?.reduce((sum, log) => sum + (log.cost_usd || 0), 0) || 0;

  // Performance trends
  const performanceTrends = aiAnalytics?.reduce((acc, analytics) => {
    const type = analytics.metric_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({
      value: Number(analytics.metric_value),
      timestamp: analytics.recorded_at
    });
    return acc;
  }, {} as Record<string, Array<{value: number, timestamp: string}>>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Optimization Engine</h2>
          <p className="text-muted-foreground">AI-powered system performance monitoring and optimization</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">Live Engine</Badge>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Execution</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgExecutionTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">AI command execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Command success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgQualityScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average quality score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">AI execution costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Performance Trends by Metric Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(performanceTrends).map(([type, values]) => {
              const avgValue = values.reduce((sum, v) => sum + v.value, 0) / values.length;
              const trend = values.length > 1 
                ? ((values[0].value - values[values.length - 1].value) / values[values.length - 1].value) * 100
                : 0;
              
              return (
                <div key={type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{type.replace(/_/g, ' ')}</h4>
                    <Badge variant={trend > 0 ? 'default' : trend < -5 ? 'destructive' : 'secondary'}>
                      {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{avgValue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{values.length} data points</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Data Quality Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataQuality?.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">Quality Report #{report.id.substring(0, 8)}</div>
                  <Badge variant={
                    Number(report.quality_score) >= 0.8 ? 'default' :
                    Number(report.quality_score) >= 0.6 ? 'secondary' : 'destructive'
                  }>
                    Score: {Number(report.quality_score).toFixed(2)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="font-medium">{Number(report.accuracy_score || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completeness</div>
                    <div className="font-medium">{Number(report.completeness_score || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Timeliness</div>
                    <div className="font-medium">{Number(report.timeliness_score || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Consistency</div>
                    <div className="font-medium">{Number(report.consistency_score || 0).toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Generated: {new Date(report.report_date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-600" />
            Active Automation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules?.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{rule.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {rule.rule_type}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {rule.description}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Executions</div>
                    <div className="font-medium">{rule.execution_count}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Success</div>
                    <div className="font-medium">{rule.success_count}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Run</div>
                    <div className="font-medium">
                      {rule.last_executed 
                        ? new Date(rule.last_executed).toLocaleString()
                        : 'Never'
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Execution Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            Recent AI Command Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {executionLogs?.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    {log.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">Execution #{log.id.substring(0, 8)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.execution_time_ms}ms • Score: {log.performance_score || 0}
                    {log.cost_usd && ` • $${log.cost_usd}`}
                  </div>
                  {log.error_message && (
                    <div className="text-xs text-red-600 mt-1">
                      {log.error_message}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase6PerformanceEngine;