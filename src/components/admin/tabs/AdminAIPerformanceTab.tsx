
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Activity, Clock, CheckCircle, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminAIPerformanceTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: aiMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['ai-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: aiPredictions = [] } = useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_predictions')
        .select(`
          *,
          prediction_models (
            name,
            model_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: commandExecutions = [] } = useQuery({
    queryKey: ['ai-command-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select(`
          *,
          ai_commands (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: performanceStats } = useQuery({
    queryKey: ['ai-performance-stats'],
    queryFn: async () => {
      const [
        totalMetrics,
        totalPredictions,
        totalExecutions,
        recentExecutions
      ] = await Promise.all([
        supabase.from('ai_performance_metrics').select('id', { count: 'exact', head: true }),
        supabase.from('ai_predictions').select('id', { count: 'exact', head: true }),
        supabase.from('ai_command_executions').select('id', { count: 'exact', head: true }),
        supabase.from('ai_command_executions')
          .select('execution_status')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const successfulExecutions = recentExecutions.data?.filter(e => e.execution_status === 'completed').length || 0;
      const totalRecentExecutions = recentExecutions.data?.length || 0;
      const successRate = totalRecentExecutions > 0 ? (successfulExecutions / totalRecentExecutions) * 100 : 0;

      return {
        totalMetrics: totalMetrics.count || 0,
        totalPredictions: totalPredictions.count || 0,
        totalExecutions: totalExecutions.count || 0,
        successRate24h: successRate,
      };
    },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredExecutions = commandExecutions.filter(execution =>
    execution.ai_commands?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    execution.execution_status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats?.totalMetrics || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats?.totalPredictions || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Command Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats?.totalExecutions || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate (24h)</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats?.successRate24h?.toFixed(1) || 0}%</div>
            <Progress value={performanceStats?.successRate24h || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="executions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="executions">Command Executions</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Command Executions</CardTitle>
              <CardDescription>Monitor AI command execution history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search executions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Command</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Execution Time</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecutions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell>
                        <div className="font-medium">{execution.ai_commands?.name || 'Unknown Command'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(execution.execution_status)}
                          <Badge variant={execution.execution_status === 'completed' ? 'default' : 
                                          execution.execution_status === 'failed' ? 'destructive' : 'secondary'}>
                            {execution.execution_status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {execution.execution_time_ms ? `${execution.execution_time_ms}ms` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(execution.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {execution.ai_commands?.category || 'Unknown'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Predictions</CardTitle>
              <CardDescription>Monitor AI prediction accuracy and confidence scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Prediction Date</TableHead>
                    <TableHead>Accuracy Check</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell>
                        <div className="font-medium">
                          {prediction.prediction_models?.name || 'Unknown Model'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {prediction.prediction_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getConfidenceColor(prediction.confidence_score)}`}>
                          {(prediction.confidence_score * 100).toFixed(1)}%
                        </div>
                        <Progress value={prediction.confidence_score * 100} className="mt-1 w-20" />
                      </TableCell>
                      <TableCell>
                        {new Date(prediction.prediction_date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {prediction.accuracy_check ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed AI system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric Type</TableHead>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Recorded At</TableHead>
                    <TableHead>Related Entity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiMetrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell>
                        <Badge variant="outline">{metric.metric_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{metric.metric_name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono">{metric.metric_value}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(metric.recorded_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {metric.related_id ? (
                          <Badge variant="secondary" className="text-xs">
                            {metric.related_id.substring(0, 8)}...
                          </Badge>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAIPerformanceTab;
