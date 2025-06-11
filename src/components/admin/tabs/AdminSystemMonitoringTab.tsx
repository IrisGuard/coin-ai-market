
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Activity, AlertTriangle, CheckCircle, TrendingUp, Cpu, HardDrive, Wifi } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminSystemMonitoringTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertFilter, setAlertFilter] = useState('all');

  const queryClient = useQueryClient();

  // System Metrics Query
  const { data: systemMetrics = [] } = useQuery({
    queryKey: ['admin-system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    }
  });

  // System Alerts Query
  const { data: systemAlerts = [] } = useQuery({
    queryKey: ['admin-system-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Performance Benchmarks Query
  const { data: benchmarks = [] } = useQuery({
    queryKey: ['admin-performance-benchmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_benchmarks')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // System Health Statistics
  const { data: healthStats } = useQuery({
    queryKey: ['admin-system-health'],
    queryFn: async () => {
      const criticalAlerts = systemAlerts.filter(alert => 
        alert.severity === 'critical' && !alert.is_resolved).length;
      const warningAlerts = systemAlerts.filter(alert => 
        alert.severity === 'warning' && !alert.is_resolved).length;
      const totalAlerts = systemAlerts.filter(alert => !alert.is_resolved).length;
      
      // Calculate average performance from recent metrics
      const recentMetrics = systemMetrics.slice(0, 10);
      const avgPerformance = recentMetrics.length > 0 
        ? recentMetrics.reduce((sum, metric) => sum + metric.metric_value, 0) / recentMetrics.length 
        : 0;

      return {
        criticalAlerts,
        warningAlerts,
        totalAlerts,
        avgPerformance: Math.round(avgPerformance * 100) / 100,
        systemHealth: criticalAlerts > 0 ? 'critical' : warningAlerts > 0 ? 'warning' : 'healthy'
      };
    },
    enabled: systemAlerts.length > 0 || systemMetrics.length > 0
  });

  // Record System Metric Mutation
  const recordMetricMutation = useMutation({
    mutationFn: async ({ metricName, metricValue, metricType, tags }) => {
      const { error } = await supabase.rpc('record_system_metric', {
        p_metric_name: metricName,
        p_metric_value: metricValue,
        p_metric_type: metricType,
        p_tags: tags || {}
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-system-metrics'] });
      toast({
        title: "Success",
        description: "System metric recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredAlerts = systemAlerts.filter(alert => {
    const matchesSearch = alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.alert_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = alertFilter === 'all' || 
                         (alertFilter === 'unresolved' && !alert.is_resolved) ||
                         (alertFilter === 'resolved' && alert.is_resolved);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* System Health Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor(healthStats?.systemHealth)}`}>
              {healthStats?.systemHealth?.toUpperCase() || 'UNKNOWN'}
            </div>
            <p className="text-xs text-muted-foreground">Overall system status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {healthStats?.criticalAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStats?.totalAlerts || 0}</div>
            <p className="text-xs text-muted-foreground">Total unresolved alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStats?.avgPerformance || 0}</div>
            <p className="text-xs text-muted-foreground">Recent metrics average</p>
          </CardContent>
        </Card>
      </div>

      {/* System Monitoring Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="benchmarks">Performance Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Monitor system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={alertFilter}
                    onChange={(e) => setAlertFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Alerts</option>
                    <option value="unresolved">Unresolved</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-system-alerts'] })}
                  variant="outline"
                  size="sm"
                >
                  Refresh
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Resolved</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <Badge variant="outline">{alert.alert_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{alert.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.severity)}
                          <Badge className={getAlertSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={alert.is_resolved ? 'default' : 'destructive'}>
                          {alert.is_resolved ? 'Resolved' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(alert.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {alert.resolved_at 
                          ? new Date(alert.resolved_at).toLocaleString()
                          : 'N/A'
                        }
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
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>Real-time system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Recorded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemMetrics.slice(0, 20).map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.metric_name}</TableCell>
                      <TableCell className="font-bold">{metric.metric_value}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{metric.metric_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {metric.tags && Object.keys(metric.tags).length > 0 
                          ? Object.entries(metric.tags).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="mr-1">
                                {key}: {value}
                              </Badge>
                            ))
                          : 'None'
                        }
                      </TableCell>
                      <TableCell>
                        {new Date(metric.recorded_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
              <CardDescription>System performance benchmarks and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benchmark</TableHead>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Baseline</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarks.map((benchmark) => {
                    const performanceRatio = benchmark.baseline_value > 0 
                      ? (benchmark.current_value / benchmark.baseline_value) * 100 
                      : 0;
                    
                    return (
                      <TableRow key={benchmark.id}>
                        <TableCell>
                          <Badge variant="outline">{benchmark.benchmark_type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{benchmark.metric_name}</TableCell>
                        <TableCell className="font-bold">{benchmark.current_value}</TableCell>
                        <TableCell>{benchmark.baseline_value}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={Math.min(performanceRatio, 100)} className="w-16" />
                            <span className="text-sm">{performanceRatio.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(benchmark.last_updated).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemMonitoringTab;
