
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Database, Server, Wifi, RefreshCw, AlertTriangle } from 'lucide-react';

const AdminSystemTab = () => {
  const systemStats = {
    uptime: '99.9%',
    responseTime: '145ms',
    dbConnections: 12,
    activeUsers: 45,
    serverLoad: '23%',
    storageUsed: '67%',
  };

  const services = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'Authentication', status: 'healthy', uptime: '99.8%' },
    { name: 'File Storage', status: 'healthy', uptime: '99.7%' },
    { name: 'Email Service', status: 'warning', uptime: '95.2%' },
    { name: 'Payment Gateway', status: 'healthy', uptime: '99.9%' },
    { name: 'AI Recognition', status: 'healthy', uptime: '98.5%' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Wifi className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStats.responseTime}</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Server Load</span>
                  <span>{systemStats.serverLoad}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: systemStats.serverLoad }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage Used</span>
                  <span>{systemStats.storageUsed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: systemStats.storageUsed }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Database Connections</span>
                  <span>{systemStats.dbConnections}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh System Stats
              </Button>
              
              <Button className="w-full" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Database Maintenance
              </Button>
              
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' :
                    service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">Uptime: {service.uptime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(service.status)}
                  <Button size="sm" variant="ghost">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemTab;
