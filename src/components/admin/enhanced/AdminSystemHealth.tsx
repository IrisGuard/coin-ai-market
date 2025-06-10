
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Shield, 
  Database, 
  Server, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

const AdminSystemHealth = () => {
  const [healthScore, setHealthScore] = useState(95);
  const [lastCheck, setLastCheck] = useState(new Date());

  const healthChecks = [
    {
      name: 'Database Connection',
      status: 'healthy',
      responseTime: 45,
      uptime: 99.9,
      icon: Database,
      details: 'All database connections active'
    },
    {
      name: 'API Services',
      status: 'healthy',
      responseTime: 120,
      uptime: 99.8,
      icon: Server,
      details: 'All API endpoints responding'
    },
    {
      name: 'Security Systems',
      status: 'healthy',
      responseTime: 25,
      uptime: 100,
      icon: Shield,
      details: 'All security checks passed'
    },
    {
      name: 'Network Connectivity',
      status: 'warning',
      responseTime: 250,
      uptime: 98.5,
      icon: Wifi,
      details: 'Minor latency detected'
    }
  ];

  const systemMetrics = [
    { name: 'CPU Usage', value: 35, max: 100, unit: '%', status: 'good' },
    { name: 'Memory Usage', value: 65, max: 100, unit: '%', status: 'good' },
    { name: 'Disk Usage', value: 45, max: 100, unit: '%', status: 'good' },
    { name: 'Network I/O', value: 78, max: 100, unit: '%', status: 'warning' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastCheck(new Date());
      // Simulate small variations in health score
      setHealthScore(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-green-600">{healthScore.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Overall System Health</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Last Check</p>
              <p className="text-sm text-muted-foreground">
                {lastCheck.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <Progress value={healthScore} className="h-3" />
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-green-600">4</p>
              <p className="text-xs text-muted-foreground">Services Online</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-blue-600">99.8%</p>
              <p className="text-xs text-muted-foreground">Avg Uptime</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-purple-600">110ms</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-orange-600">0</p>
              <p className="text-xs text-muted-foreground">Critical Issues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthChecks.map((check, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <check.icon className="w-5 h-5" />
                    <span className="font-medium">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    {getStatusBadge(check.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Response Time</p>
                    <p className="font-medium">{check.responseTime}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-medium">{check.uptime}%</p>
                  </div>
                  <div className="md:col-span-1 col-span-2">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">{check.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Resource Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.name}</span>
                  <span>{metric.value}{metric.unit}</span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0{metric.unit}</span>
                  <span>{metric.max}{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemHealth;
