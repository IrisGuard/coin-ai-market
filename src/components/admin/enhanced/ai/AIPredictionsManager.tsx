
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Target, Brain } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AIPredictionsManager = () => {
  // Use existing AI performance metrics table instead of non-existent ai_predictions
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['ai-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  const getConfidenceColor = (value: number) => {
    if (value >= 0.8) return 'bg-green-100 text-green-800';
    if (value >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const stats = {
    total: predictions?.length || 0,
    highConfidence: predictions?.filter(p => p.metric_value >= 0.8).length || 0,
    avgConfidence: predictions?.reduce((sum, p) => sum + p.metric_value, 0) / (predictions?.length || 1) || 0,
    types: new Set(predictions?.map(p => p.metric_type)).size || 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            AI Performance Metrics Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.highConfidence}</div>
              <div className="text-sm text-muted-foreground">High Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(stats.avgConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Avg Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.types}</div>
              <div className="text-sm text-muted-foreground">Metric Types</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Metric Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Recorded</TableHead>
                <TableHead>Related ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions?.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell>
                    <Badge variant="outline">{metric.metric_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{metric.metric_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getConfidenceColor(metric.metric_value)}>
                      {(metric.metric_value * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(metric.recorded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {metric.related_id ? (
                      <span className="text-xs text-muted-foreground">{metric.related_id}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPredictionsManager;
