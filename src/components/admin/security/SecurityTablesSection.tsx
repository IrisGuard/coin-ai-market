
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, AlertTriangle, Eye, Settings, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SecurityTablesSection = () => {
  const securityTables = [
    {
      name: 'admin_activity_logs',
      description: 'Admin user activity tracking',
      records: '5,678',
      status: 'active',
      lastActivity: '2 min ago',
      icon: Activity,
      criticalLevel: 'high'
    },
    {
      name: 'admin_roles',
      description: 'Administrative role definitions',
      records: '12',
      status: 'active',
      lastActivity: '1 hour ago',
      icon: Shield,
      criticalLevel: 'critical'
    },
    {
      name: 'security_incidents',
      description: 'Security incident tracking',
      records: '23',
      status: 'active',
      lastActivity: '5 min ago',
      icon: AlertTriangle,
      criticalLevel: 'critical'
    },
    {
      name: 'security_logs',
      description: 'General security event logs',
      records: '8,901',
      status: 'active',
      lastActivity: '30 sec ago',
      icon: Eye,
      criticalLevel: 'high'
    },
    {
      name: 'access_logs',
      description: 'User access and authentication logs',
      records: '45,678',
      status: 'active',
      lastActivity: '10 sec ago',
      icon: Key,
      criticalLevel: 'medium'
    },
    {
      name: 'audit_trails',
      description: 'Complete audit trail records',
      records: '12,345',
      status: 'active',
      lastActivity: '1 min ago',
      icon: Settings,
      criticalLevel: 'high'
    }
  ];

  const getCriticalLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Tables</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityTables.length}</div>
            <p className="text-xs text-muted-foreground">Active security tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">0</div>
            <p className="text-xs text-muted-foreground">No critical incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">Excellent security</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Tables List */}
      <div className="grid gap-4 md:grid-cols-2">
        {securityTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                  </div>
                  <Badge className={getCriticalLevelColor(table.criticalLevel)}>
                    {table.criticalLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{table.records}</span> records
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Updated {table.lastActivity}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'Admin Login',
                user: 'admin@coinai.com',
                timestamp: '2 minutes ago',
                status: 'success',
                ip: '192.168.1.100'
              },
              {
                type: 'Security Policy Update',
                user: 'system',
                timestamp: '5 minutes ago',
                status: 'success',
                ip: 'internal'
              },
              {
                type: 'Failed Login Attempt',
                user: 'unknown',
                timestamp: '10 minutes ago',
                status: 'blocked',
                ip: '203.45.67.89'
              }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    event.status === 'success' ? 'bg-green-500' :
                    event.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{event.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.user} • {event.ip}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.timestamp}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTablesSection;
