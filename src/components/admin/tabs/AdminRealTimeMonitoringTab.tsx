
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  RefreshCw,
  Pause,
  Play
} from 'lucide-react';
import RealTimeAdminDashboard from '../enhanced/RealTimeAdminDashboard';

const AdminRealTimeMonitoringTab = () => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock real-time data (in production this would come from WebSocket or polling)
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.9%',
    responseTime: 245,
    activeUsers: 156,
    requestsPerMinute: 1247,
    errorRate: 0.02,
    cpuUsage: 34,
    memoryUsage: 67,
    diskUsage: 45
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        requestsPerMinute: prev.requestsPerMinute + Math.floor(Math.random() * 100 - 50),
        responseTime: Math.max(100, prev.responseTime + Math.floor(Math.random() * 50 - 25)),
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + Math.floor(Math.random() * 10 - 5))),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + Math.floor(Math.random() * 6 - 3)))
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const StatusIcon = getStatusIcon(systemHealth.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time System Monitoring</h2>
          <p className="text-muted-foreground">
            Live system performance and health monitoring dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? 'default' : 'secondary'} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'LIVE' : 'PAUSED'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${getStatusColor(systemHealth.status)}`} />
            System Status
            <Badge variant="outline" className="ml-auto">
              Last update: {lastUpdate.toLocaleTimeString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Health</span>
                <Badge variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}>
                  {systemHealth.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Uptime</span>
                <span className="font-medium">{systemHealth.uptime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Response Time</span>
                <span className="font-medium">{systemHealth.responseTime}ms</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Active Users</span>
                <span className="font-medium">{systemHealth.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Requests/Min</span>
                <span className="font-medium">{systemHealth.requestsPerMinute.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Error Rate</span>
                <span className="font-medium">{(systemHealth.errorRate * 100).toFixed(2)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>CPU Usage</span>
                <span className="font-medium">{systemHealth.cpuUsage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Memory Usage</span>
                <span className="font-medium">{systemHealth.memoryUsage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Disk Usage</span>
                <span className="font-medium">{systemHealth.diskUsage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Real-Time Dashboard */}
      <RealTimeAdminDashboard />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Metrics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">View Alerts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Active Sessions</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-sm">System Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRealTimeMonitoringTab;
