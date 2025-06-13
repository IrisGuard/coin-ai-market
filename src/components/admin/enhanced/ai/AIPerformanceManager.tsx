
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Zap, Clock, Target, BarChart3, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AIPerformanceManager = () => {
  const { data: performanceMetrics, isLoading } = useQuery({
    queryKey: ['ai-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching AI performance metrics:', error);
        throw error;
      }
      
      console.log('✅ AI performance metrics loaded:', data?.length);
      return data || [];
    }
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['ai-performance-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('❌ Error fetching AI performance analytics:', error);
        throw error;
      }
      
      console.log('✅ AI performance analytics loaded:', data?.length);
      return data || [];
    }
  });

  const getMetricTypeColor = (type: string) => {
    switch (type) {
      case 'accuracy': return 'bg-green-100 text-green-800';
      case 'speed': return 'bg-blue-100 text-blue-800';
      case 'confidence': return 'bg-purple-100 text-purple-800';
      case 'error_rate': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalMetrics: performanceMetrics?.length || 0,
    avgAccuracy: performanceMetrics?.filter(m => m.metric_type === 'accuracy')
      .reduce((sum, m) => sum + (m.metric_value || 0), 0) / 
      (performanceMetrics?.filter(m => m.metric_type === 'accuracy').length || 1),
    avgSpeed: performanceMetrics?.filter(m => m.metric_type === 'speed')
      .reduce((sum, m) => sum + (m.metric_value || 0), 0) / 
      (performanceMetrics?.filter(m => m.metric_type === 'speed').length || 1),
    recentAnalytics: analytics?.length || 0
  };

  if (isLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              AI Performance Management
            </CardTitle>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Metrics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalMetrics}</div>
              <div className="text-sm text-muted-foreground">Total Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(stats.avgAccuracy * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats.avgSpeed)}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Speed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.recentAnalytics}</div>
              <div className="text-sm text-muted-foreground">Recent Analytics</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Recorded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceMetrics?.slice(0, 10).map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell>
                      <div className="font-medium">{metric.metric_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMetricTypeColor(metric.metric_type)}>
                        {metric.metric_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {typeof metric.metric_value === 'number' ? 
                          metric.metric_value.toFixed(2) : metric.metric_value}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <div className="text-sm">
                          {new Date(metric.recorded_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Analytics Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Command</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Context</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics?.slice(0, 10).map((analytic) => (
                  <TableRow key={analytic.id}>
                    <TableCell>
                      <div className="font-medium">{analytic.metric_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {analytic.command_id ? 'Command' : 'System'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {typeof analytic.metric_value === 'number' ? 
                          analytic.metric_value.toFixed(2) : analytic.metric_value}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {analytic.execution_context && Object.keys(analytic.execution_context).length > 0 ? 
                          'With Context' : 'No Context'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPerformanceManager;
