
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AIBrainStats from './AIBrainStats';
import SiteManagementSection from './SiteManagementSection';

const RealTimeAIBrainDashboard = () => {
  // Real-time performance chart data
  const { data: performanceData } = useQuery({
    queryKey: ['ai-performance-chart'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('metric_value, recorded_at, metric_name')
        .eq('metric_type', 'execution_time')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      if (error) throw error;

      // Group data by hour for chart
      const hourlyData = (data || []).reduce((acc, item) => {
        const hour = new Date(item.recorded_at).getHours();
        const key = `${hour}:00`;
        
        if (!acc[key]) {
          acc[key] = { time: key, avgTime: 0, count: 0, total: 0 };
        }
        
        acc[key].total += item.metric_value;
        acc[key].count += 1;
        acc[key].avgTime = acc[key].total / acc[key].count;
        
        return acc;
      }, {} as Record<string, any>);

      return Object.values(hourlyData);
    },
    refetchInterval: 30000
  });

  // Real-time system alerts
  const { data: systemAlerts } = useQuery({
    queryKey: ['ai-system-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select('error_message, created_at, ai_commands(name)')
        .eq('execution_status', 'failed')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">AI Brain Real-Time Dashboard</h1>
          <p className="text-gray-600">Live monitoring and performance analytics</p>
        </div>
      </div>

      {/* Real-time Stats */}
      <AIBrainStats />

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trends (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Avg Execution Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Site Management */}
      <SiteManagementSection />

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {systemAlerts && systemAlerts.length > 0 ? (
              systemAlerts.map((alert, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-800">
                      {alert.ai_commands?.name || 'Unknown Command'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    {alert.error_message || 'Execution failed'}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent alerts</p>
                <p className="text-sm">AI Brain is running smoothly</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAIBrainDashboard;
