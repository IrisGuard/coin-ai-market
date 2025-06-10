
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  Database, 
  Users, 
  Zap,
  Globe,
  CPU,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminMonitoringDashboardTab = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock real-time data
  const systemMetrics = {
    cpu_usage: 45,
    memory_usage: 67,
    disk_usage: 23,
    network_usage: 12,
    active_users: 234,
    database_connections: 45,
    api_requests_per_minute: 1250,
    error_rate: 0.3
  };

  const services = [
    { name: 'Web Server', status: 'healthy', response_time: '125ms', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', response_time: '15ms', uptime: '99.8%' },
    { name: 'Redis Cache', status: 'healthy', response_time: '5ms', uptime: '100%' },
    { name: 'AI Service', status: 'warning', response_time: '450ms', uptime: '98.5%' },
    { name: 'Image Storage', status: 'healthy', response_time: '89ms', uptime: '99.7%' },
    { name: 'Email Service', status: 'healthy', response_time: '200ms', uptime: '99.9%' }
  ];

  const recentAlerts = [
    {
      id: '1',
      type: 'warning',
      message: 'High CPU usage detected on web server',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Database backup completed successfully',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      resolved: true
    },
    {
      id: '3',
      type: 'error',
      message: 'AI service timeout increased beyond threshold',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      resolved: false
    }
  ];

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time System Monitoring</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live - {currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CPU className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <span className="text-lg font-bold">{systemMetrics.cpu_usage}%</span>
            </div>
            <Progress value={systemMetrics.cpu_usage} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <span className="text-lg font-bold">{systemMetrics.memory_usage}%</span>
            </div>
            <Progress value={systemMetrics.memory_usage} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Disk Usage</span>
              </div>
              <span className="text-lg font-bold">{systemMetrics.disk_usage}%</span>
            </div>
            <Progress value={systemMetrics.disk_usage} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">Network</span>
              </div>
              <span className="text-lg font-bold">{systemMetrics.network_usage}%</span>
            </div>
            <Progress value={systemMetrics.network_usage} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{systemMetrics.active_users}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">DB Connections</p>
                <p className="text-2xl font-bold">{systemMetrics.database_connections}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">API Requests/min</p>
                <p className="text-2xl font-bold">{systemMetrics.api_requests_per_minute.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold">{systemMetrics.error_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Service Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{service.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getServiceStatusColor(service.status)}`}>
                    {getServiceStatusIcon(service.status)}
                    {service.status}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium">{service.response_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${alert.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">{alert.message}</span>
                    {alert.resolved && (
                      <Badge variant="outline" className="text-xs">Resolved</Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Traffic & Load */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Network Traffic (Real-time)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Incoming Traffic</span>
                <span className="font-mono">1.2 MB/s</span>
              </div>
              <Progress value={60} className="h-2" />
              <div className="flex items-center justify-between">
                <span>Outgoing Traffic</span>
                <span className="font-mono">0.8 MB/s</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server Load Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Web Server 1</span>
                <span className="font-mono">45% load</span>
              </div>
              <Progress value={45} className="h-2" />
              <div className="flex items-center justify-between">
                <span>Web Server 2</span>
                <span className="font-mono">38% load</span>
              </div>
              <Progress value={38} className="h-2" />
              <div className="flex items-center justify-between">
                <span>Database Server</span>
                <span className="font-mono">22% load</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMonitoringDashboardTab;
