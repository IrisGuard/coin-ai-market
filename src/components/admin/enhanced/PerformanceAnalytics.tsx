
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity, TrendingUp, Clock, Zap } from 'lucide-react';

const PerformanceAnalytics = () => {
  // Fetch system metrics
  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching system metrics:', error);
        return [];
      }

      return data || [];
    }
  });

  // Calculate performance analytics
  const analytics = React.useMemo(() => {
    if (!metrics.length) {
      return {
        avgResponseTime: 0,
        totalMetrics: 0,
        metricTypes: {},
        recentMetrics: []
      };
    }

    const responseTimeMetrics = metrics.filter(m => m.metric_name.includes('response'));
    const avgResponseTime = responseTimeMetrics.length > 0 
      ? responseTimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / responseTimeMetrics.length
      : 0;

    const metricTypes: Record<string, number> = {};
    metrics.forEach(metric => {
      metricTypes[metric.metric_type] = (metricTypes[metric.metric_type] || 0) + 1;
    });

    return {
      avgResponseTime: Math.round(avgResponseTime),
      totalMetrics: metrics.length,
      metricTypes,
      recentMetrics: metrics.slice(0, 10)
    };
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.avgResponseTime}ms
                </div>
                <p className="text-xs text-muted-foreground">Avg Response Time</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.totalMetrics}
                </div>
                <p className="text-xs text-muted-foreground">Total Metrics</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(analytics.metricTypes).length}
                </div>
                <p className="text-xs text-muted-foreground">Metric Types</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <p className="text-xs text-muted-foreground">System Health</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Metric Types Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.metricTypes).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{type}</div>
              </div>
            ))}
            
            {Object.keys(analytics.metricTypes).length === 0 && (
              <div className="col-span-4 text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No metrics data available</p>
                <p className="text-sm">Performance metrics will appear here once collected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{metric.metric_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {metric.metric_type} • {new Date(metric.recorded_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{metric.metric_value}</div>
                  <Badge variant="outline">{metric.metric_type}</Badge>
                </div>
              </div>
            ))}
            
            {analytics.recentMetrics.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No recent metrics</p>
                <p className="text-sm">Performance metrics will be displayed here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
