
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Cpu, Database, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRealTimeMonitoring } from '@/hooks/admin/useRealTimeMonitoring';
import { useSystemHealth } from '@/hooks/admin/useSystemHealth';

const RealTimeSystemMonitor = () => {
  const { metrics, isConnected } = useRealTimeMonitoring();
  const { data: health, isLoading: healthLoading } = useSystemHealth();

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-Time System Monitor
            </span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'Live' : 'Disconnected'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">
            Last updated: {metrics.lastUpdated.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="text-center py-4">Loading system health...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {health?.status === 'healthy' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">Status</span>
                </div>
                <Badge variant={health?.status === 'healthy' ? 'default' : 'destructive'}>
                  {health?.status || 'Unknown'}
                </Badge>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Database</div>
                <Badge variant={health?.databaseStatus === 'connected' ? 'default' : 'destructive'}>
                  {health?.databaseStatus || 'Unknown'}
                </Badge>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">API Response</div>
                <div className="text-sm">{health?.apiResponseTime || 0}ms</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Uptime</div>
                <div className="text-sm text-green-600">{health?.uptime || '0%'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.activeUsers}</div>
            <div className="text-sm text-gray-500">Currently online</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">{metrics.systemLoad.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.systemLoad} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Last Hour</span>
                <span className="text-sm font-medium">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              <Progress 
                value={metrics.errorRate} 
                className="h-2" 
                // @ts-ignore
                indicatorClassName={metrics.errorRate > 5 ? 'bg-red-500' : 'bg-green-500'}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</div>
            <div className="text-sm text-gray-500">Average response time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.throughput.toFixed(0)}</div>
            <div className="text-sm text-gray-500">Requests per minute</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Users</span>
                <span className="text-sm font-medium">{health?.total_users || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Coins</span>
                <span className="text-sm font-medium">{health?.total_coins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Value</span>
                <span className="text-sm font-medium">€{health?.total_value?.toLocaleString() || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeSystemMonitor;
