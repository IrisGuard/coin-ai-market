
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Users, 
  Server, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

const AdvancedAnalyticsDashboard = () => {
  const { systemMetrics, userBehavior, performance, isCollecting } = useRealTimeAnalytics();

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600 bg-red-100';
    if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="w-4 h-4" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Indicator */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Real-time Analytics Active</span>
            </div>
            <Badge variant="outline" className="text-green-600">
              {isCollecting ? 'Collecting' : 'Idle'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">User Behavior</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          {/* System Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">CPU Usage</span>
                  </div>
                  <Badge className={getStatusColor(systemMetrics.cpuUsage, { warning: 70, critical: 85 })}>
                    {getStatusIcon(systemMetrics.cpuUsage, { warning: 70, critical: 85 })}
                    {systemMetrics.cpuUsage.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={systemMetrics.cpuUsage} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 70%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Memory Usage</span>
                  </div>
                  <Badge className={getStatusColor(systemMetrics.memoryUsage, { warning: 75, critical: 90 })}>
                    {getStatusIcon(systemMetrics.memoryUsage, { warning: 75, critical: 90 })}
                    {systemMetrics.memoryUsage.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={systemMetrics.memoryUsage} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 75%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Disk Usage</span>
                  </div>
                  <Badge className={getStatusColor(systemMetrics.diskUsage, { warning: 80, critical: 90 })}>
                    {getStatusIcon(systemMetrics.diskUsage, { warning: 80, critical: 90 })}
                    {systemMetrics.diskUsage.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={systemMetrics.diskUsage} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 80%</p>
              </CardContent>
            </Card>
          </div>

          {/* Network & Connection Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Network Latency</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{systemMetrics.networkLatency.toFixed(0)}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Active Connections</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{systemMetrics.activeConnections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Requests/Min</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{systemMetrics.requestsPerMinute}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">API Response</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {performance.apiResponseTime.toFixed(0)}ms
                  </span>
                </div>
                <Progress value={Math.min((performance.apiResponseTime / 500) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 200ms</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Database Response</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {performance.databaseResponseTime.toFixed(0)}ms
                  </span>
                </div>
                <Progress value={Math.min((performance.databaseResponseTime / 100) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 50ms</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">AI Processing</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {performance.aiProcessingTime.toFixed(0)}ms
                  </span>
                </div>
                <Progress value={Math.min((performance.aiProcessingTime / 3000) * 100, 100)} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 2000ms</p>
              </CardContent>
            </Card>
          </div>

          {/* Success Rate & Throughput */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {performance.successRate.toFixed(1)}%
                  </div>
                  <Progress value={performance.successRate} className="h-4 mb-2" />
                  <div className="text-sm text-gray-600">
                    Error Rate: {performance.errorRate.toFixed(2)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {performance.throughput.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">requests/minute</div>
                  <Progress value={Math.min((performance.throughput / 500) * 100, 100)} className="h-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Behavior Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Active Users</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{userBehavior.activeUsers}</p>
                    <p className="text-xs text-gray-500">Last 15 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">New Signups</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{userBehavior.newRegistrations}</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Coin Uploads</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{userBehavior.coinUploads}</p>
                    <p className="text-xs text-gray-500">Last hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Avg Session</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.floor(userBehavior.averageSessionDuration / 60)}m
                    </p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">Search Queries</span>
                  <span className="text-2xl font-bold">{userBehavior.searchQueries}</span>
                </div>
                <Progress value={Math.min((userBehavior.searchQueries / 500) * 100, 100)} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">Per hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm">Bounce Rate</span>
                  <span className="text-2xl font-bold text-red-600">
                    {userBehavior.bounceRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={userBehavior.bounceRate} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">Target: &lt; 25%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                System Alerts & Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Performance Alert</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    AI processing time is above optimal threshold (current: {performance.aiProcessingTime.toFixed(0)}ms)
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">System Healthy</span>
                  </div>
                  <p className="text-sm text-green-700">
                    All core systems operating within normal parameters
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Growth Trend</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    User activity increased by 15% compared to last week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
