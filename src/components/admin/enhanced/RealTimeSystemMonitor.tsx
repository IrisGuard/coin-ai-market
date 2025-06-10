
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, AlertTriangle, CheckCircle, Clock, 
  Zap, Database, Server, TrendingUp, Bell
} from 'lucide-react';
import { useSystemPerformanceMetrics, useSystemAlerts, usePerformanceBenchmarks, useResolveAlert, useCreateSystemAlert } from '@/hooks/admin/useSystemMonitoring';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

const RealTimeSystemMonitor = () => {
  const { data: performanceMetrics, isLoading: metricsLoading } = useSystemPerformanceMetrics();
  const { data: alerts } = useSystemAlerts();
  const { data: benchmarks } = usePerformanceBenchmarks();
  const resolveAlert = useResolveAlert();
  const createAlert = useCreateSystemAlert();

  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSystemHealthBg = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'critical': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlert.mutateAsync(alertId);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const mockPerformanceData = [
    { time: '00:00', response_time: 120, cpu_usage: 45, memory_usage: 62, errors: 2 },
    { time: '01:00', response_time: 135, cpu_usage: 52, memory_usage: 58, errors: 1 },
    { time: '02:00', response_time: 118, cpu_usage: 48, memory_usage: 65, errors: 0 },
    { time: '03:00', response_time: 142, cpu_usage: 55, memory_usage: 61, errors: 3 },
    { time: '04:00', response_time: 128, cpu_usage: 49, memory_usage: 59, errors: 1 },
  ];

  if (metricsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading system monitoring data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className={`text-2xl font-bold ${getSystemHealthColor(performanceMetrics?.system_health || 'healthy')}`}>
                  {performanceMetrics?.system_health || 'Healthy'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getSystemHealthBg(performanceMetrics?.system_health || 'healthy')}`}>
                <Activity className={`w-6 h-6 ${getSystemHealthColor(performanceMetrics?.system_health || 'healthy')}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(performanceMetrics?.avg_response_time || 0)}ms
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-green-600">
                  {performanceMetrics?.active_sessions || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors (1h)</p>
                <p className="text-2xl font-bold text-red-600">
                  {performanceMetrics?.errors_last_hour || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Monitoring Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="live-stream">Live Stream</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="response_time" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Resource Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cpu_usage" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="memory_usage" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  System Alerts
                </span>
                <Badge variant="outline">
                  {alerts?.filter(alert => !alert.is_resolved).length || 0} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts?.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.is_resolved ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleResolveAlert(alert.id)}
                          disabled={resolveAlert.isPending}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!alerts || alerts.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No system alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks">
          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benchmarks?.map((benchmark) => (
                  <div key={benchmark.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{benchmark.metric_name}</h4>
                      <Badge variant="outline">{benchmark.benchmark_type}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Baseline:</span>
                        <span className="ml-2 font-medium">{benchmark.baseline_value}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Current:</span>
                        <span className={`ml-2 font-medium ${
                          benchmark.current_value > benchmark.threshold_critical ? 'text-red-600' :
                          benchmark.current_value > benchmark.threshold_warning ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {benchmark.current_value}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Updated:</span>
                        <span className="ml-2">{new Date(benchmark.last_updated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!benchmarks || benchmarks.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                    <p>No performance benchmarks configured</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-stream">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{new Date(Date.now() - i * 30000).toLocaleTimeString()}</span>
                    <span>System activity event {i + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeSystemMonitor;
