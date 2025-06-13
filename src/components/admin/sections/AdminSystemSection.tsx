
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Monitor, AlertTriangle, Shield, Cpu, HardDrive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminSystemSection = () => {
  const systemTables = [
    {
      name: 'system_metrics',
      description: 'System performance and health metrics',
      records: '45,678',
      status: 'active',
      icon: Monitor,
      health: 'excellent'
    },
    {
      name: 'system_alerts',
      description: 'System alerts and notifications',
      records: '234',
      status: 'active',
      icon: AlertTriangle,
      health: 'good'
    },
    {
      name: 'security_incidents',
      description: 'Security incident tracking',
      records: '12',
      status: 'active',
      icon: Shield,
      health: 'excellent'
    },
    {
      name: 'bulk_operations',
      description: 'Background bulk operation jobs',
      records: '89',
      status: 'active',
      icon: Server,
      health: 'good'
    }
  ];

  const systemStats = [
    { label: 'System Health', value: '98.5%', icon: Monitor, color: 'text-green-600' },
    { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Security Score', value: '95%', icon: Shield, color: 'text-blue-600' },
    { label: 'Uptime', value: '99.9%', icon: Server, color: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">System monitoring</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        {systemTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{table.records}</span> records
                  </div>
                  <Badge className={
                    table.health === 'excellent' ? 'bg-green-100 text-green-800' :
                    table.health === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {table.health}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Monitor
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Resources */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { resource: 'CPU Usage', usage: 67, icon: Cpu, color: 'bg-blue-500' },
                { resource: 'Memory Usage', usage: 45, icon: Monitor, color: 'bg-green-500' },
                { resource: 'Disk Usage', usage: 78, icon: HardDrive, color: 'bg-yellow-500' },
                { resource: 'Network I/O', usage: 23, icon: Server, color: 'bg-purple-500' }
              ].map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <div key={resource.resource} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">{resource.resource}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${resource.color}`}
                          style={{ width: `${resource.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10">{resource.usage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent System Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { event: 'Database Backup Completed', time: '10 minutes ago', severity: 'info' },
                { event: 'High Memory Usage Alert', time: '1 hour ago', severity: 'warning' },
                { event: 'API Rate Limit Reached', time: '2 hours ago', severity: 'warning' },
                { event: 'System Update Applied', time: '6 hours ago', severity: 'success' }
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-l-2 border-l-gray-300 pl-3">
                  <div>
                    <p className="text-sm font-medium">{event.event}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                  <Badge variant={
                    event.severity === 'success' ? 'default' :
                    event.severity === 'warning' ? 'secondary' : 'outline'
                  }>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSystemSection;
