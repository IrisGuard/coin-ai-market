
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Server, 
  Database, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Wifi,
  Shield,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  Settings
} from 'lucide-react';

const AdminSystemTab = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock system data
  const systemStats = {
    server: {
      status: 'healthy',
      uptime: '15 days, 7 hours',
      load: 45,
      memory: 68,
      disk: 32,
      cpu: 23
    },
    database: {
      status: 'optimal',
      connections: 15,
      maxConnections: 100,
      queryTime: 12.5,
      size: '2.3 GB'
    },
    performance: {
      responseTime: 245,
      throughput: 1247,
      errorRate: 0.2,
      availability: 99.9
    }
  };

  const systemServices = [
    { name: 'Web Server', status: 'running', health: 'good', port: 3000 },
    { name: 'Database', status: 'running', health: 'excellent', port: 5432 },
    { name: 'Redis Cache', status: 'running', health: 'good', port: 6379 },
    { name: 'File Storage', status: 'running', health: 'excellent', port: 8080 },
    { name: 'Authentication', status: 'running', health: 'good', port: 8000 },
    { name: 'Email Service', status: 'running', health: 'good', port: 587 }
  ];

  const recentLogs = [
    { time: '14:32:15', level: 'INFO', message: 'Database backup completed successfully', service: 'Database' },
    { time: '14:31:42', level: 'INFO', message: 'Cache cleared and refreshed', service: 'Redis' },
    { time: '14:30:28', level: 'WARN', message: 'High memory usage detected', service: 'Web Server' },
    { time: '14:29:15', level: 'INFO', message: 'User authentication successful', service: 'Auth' },
    { time: '14:28:03', level: 'INFO', message: 'File upload processed', service: 'Storage' }
  ];

  const handleRefreshStats = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-100 text-green-800">Running</Badge>;
      case 'stopped':
        return <Badge className="bg-red-100 text-red-800">Stopped</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthIndicator = (health: string) => {
    switch (health) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <Badge className="bg-red-100 text-red-800 text-xs">ERROR</Badge>;
      case 'WARN':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">WARN</Badge>;
      case 'INFO':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">INFO</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Administration</h3>
          <p className="text-sm text-muted-foreground">
            Monitor and manage system health, performance, and configuration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshStats}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          All systems are operational. Last health check: {new Date().toLocaleTimeString()}
        </AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Server Status</p>
                <p className="font-medium text-green-600">Healthy</p>
                <p className="text-xs text-gray-500">Uptime: {systemStats.server.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Database</p>
                <p className="font-medium text-green-600">Optimal</p>
                <p className="text-xs text-gray-500">{systemStats.database.connections}/{systemStats.database.maxConnections} connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="font-medium">{systemStats.performance.responseTime}ms</p>
                <p className="text-xs text-gray-500">Average last hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Availability</p>
                <p className="font-medium text-green-600">{systemStats.performance.availability}%</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU Usage
                    </span>
                    <span className="text-sm font-medium">{systemStats.server.cpu}%</span>
                  </div>
                  <Progress value={systemStats.server.cpu} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <MemoryStick className="h-4 w-4" />
                      Memory Usage
                    </span>
                    <span className="text-sm font-medium">{systemStats.server.memory}%</span>
                  </div>
                  <Progress value={systemStats.server.memory} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Disk Usage
                    </span>
                    <span className="text-sm font-medium">{systemStats.server.disk}%</span>
                  </div>
                  <Progress value={systemStats.server.disk} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      System Load
                    </span>
                    <span className="text-sm font-medium">{systemStats.server.load}%</span>
                  </div>
                  <Progress value={systemStats.server.load} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-green-600">Optimal</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-medium">{systemStats.database.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Connections</p>
                    <p className="font-medium">{systemStats.database.connections}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Query Time</p>
                    <p className="font-medium">{systemStats.database.queryTime}ms</p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getHealthIndicator(service.health)}
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">Port: {service.port}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(service.status)}
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{systemStats.performance.responseTime}ms</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{systemStats.performance.throughput}</div>
                  <div className="text-sm text-gray-600">Requests/Hour</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{systemStats.performance.errorRate}%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{systemStats.performance.availability}%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Performance charts would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-l-4 border-l-blue-500 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      {getLevelBadge(log.level)}
                      <div>
                        <p className="text-sm font-medium">{log.message}</p>
                        <p className="text-xs text-gray-500">Service: {log.service}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {log.time}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View Full Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemTab;
