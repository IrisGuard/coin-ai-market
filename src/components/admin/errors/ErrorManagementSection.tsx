
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bug, Search, Shield, Activity, Database, FileText, HeartHandshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ErrorManagementSection = () => {
  const errorTables = [
    {
      name: 'error_logs',
      description: 'Application error tracking',
      records: '12,345',
      status: 'active',
      icon: Bug,
      severity: 'high',
      recent: '2 min ago'
    },
    {
      name: 'console_errors',
      description: 'Browser console error logs',
      records: '23,456',
      status: 'active',
      icon: FileText,
      severity: 'medium',
      recent: '5 min ago'
    },
    {
      name: 'error_coins_knowledge',
      description: 'Error coin identification database',
      records: '1,234',
      status: 'active',
      icon: Search,
      severity: 'low',
      recent: '1 hour ago'
    },
    {
      name: 'error_coins_market_data',
      description: 'Error coin market valuations',
      records: '5,678',
      status: 'active',
      icon: Database,
      severity: 'low',
      recent: '30 min ago'
    },
    {
      name: 'error_pattern_matches',
      description: 'Pattern matching results',
      records: '890',
      status: 'active',
      icon: Shield,
      severity: 'medium',
      recent: '15 min ago'
    },
    {
      name: 'error_reference_sources',
      description: 'Reference source configurations',
      records: '45',
      status: 'active',
      icon: Database,
      severity: 'low',
      recent: '2 hours ago'
    },
    {
      name: 'system_alerts',
      description: 'System-wide alert notifications',
      records: '678',
      status: 'active',
      icon: AlertTriangle,
      severity: 'high',
      recent: '1 min ago'
    },
    {
      name: 'health_checks',
      description: 'System health monitoring',
      records: '12,345',
      status: 'active',
      icon: HeartHandshake,
      severity: 'medium',
      recent: '30 sec ago'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const errorStats = [
    { label: 'Error Tables', value: errorTables.length, icon: Database, color: 'text-blue-600' },
    { label: 'Critical Errors', value: '3', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Error Coins DB', value: '1,234', icon: Search, color: 'text-purple-600' },
    { label: 'System Health', value: '98%', icon: HeartHandshake, color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Error Management Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {errorStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Current status</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {errorTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                  </div>
                  <Badge className={getSeverityColor(table.severity)}>
                    {table.severity}
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
                    Updated {table.recent}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Logs
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Error Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Error Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'Database Connection Error',
                source: 'api/users',
                severity: 'high',
                timestamp: '2 minutes ago',
                count: 1
              },
              {
                type: 'Authentication Failed',
                source: 'auth/login',
                severity: 'medium',
                timestamp: '15 minutes ago',
                count: 3
              },
              {
                type: 'Image Processing Timeout',
                source: 'ai/analyze',
                severity: 'medium',
                timestamp: '30 minutes ago',
                count: 2
              },
              {
                type: 'Payment Gateway Error',
                source: 'payments/process',
                severity: 'high',
                timestamp: '1 hour ago',
                count: 1
              }
            ].map((error, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    error.severity === 'high' ? 'bg-red-500' :
                    error.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">{error.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {error.source} • {error.count} occurrence{error.count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {error.timestamp}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorManagementSection;
