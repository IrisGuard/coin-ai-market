
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, Users, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useErrorLogs, useMarketplaceStats } from '@/hooks/admin/useAdminSystem';
import { supabase } from '@/integrations/supabase/client';

const RealTimeMonitoring = () => {
  const { systemMetrics, userBehavior, performance, isCollecting } = useRealTimeAnalytics();
  const { data: errorLogs } = useErrorLogs();
  const { data: marketplaceStats } = useMarketplaceStats();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  useEffect(() => {
    // Monitor Supabase connection status
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        setConnectionStatus(error ? 'disconnected' : 'connected');
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const recentErrors = errorLogs?.slice(0, 5) || [];
  const systemHealth = recentErrors.length < 10 ? 'healthy' : recentErrors.length < 50 ? 'warning' : 'critical';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time System Monitoring</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isCollecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isCollecting ? 'Collecting metrics...' : 'Metrics collection paused'}
          </span>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Supabase Connection</span>
            <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'connecting' ? 'secondary' : 'destructive'}>
              {connectionStatus === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
              {connectionStatus === 'disconnected' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-electric-purple" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU Usage</span>
                <span>{systemMetrics?.cpuUsage?.toFixed(1) || 0}%</span>
              </div>
              <Progress value={systemMetrics?.cpuUsage || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory Usage</span>
                <span>{systemMetrics?.memoryUsage?.toFixed(1) || 0}%</span>
              </div>
              <Progress value={systemMetrics?.memoryUsage || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Network Latency</span>
                <span>{systemMetrics?.networkLatency?.toFixed(0) || 0}ms</span>
              </div>
              <Progress value={Math.max(0, 100 - (systemMetrics?.networkLatency || 0))} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-electric-blue" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Active Users</span>
              <span className="font-medium">{userBehavior?.activeUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">New Registrations</span>
              <span className="font-medium">{userBehavior?.newRegistrations || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Coin Uploads</span>
              <span className="font-medium">{userBehavior?.coinUploads || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Search Queries</span>
              <span className="font-medium">{userBehavior?.searchQueries || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-electric-green" />
              AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Success Rate</span>
                <span>{performance?.successRate?.toFixed(1) || 0}%</span>
              </div>
              <Progress value={performance?.successRate || 0} className="h-2" />
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Processing Time</span>
              <span className="font-medium">{performance?.aiProcessingTime?.toFixed(0) || 0}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Throughput</span>
              <span className="font-medium">{performance?.throughput?.toFixed(0) || 0} req/min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="font-medium text-red-600">{performance?.errorRate?.toFixed(2) || 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Recent Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-4 h-4 rounded-full ${
                systemHealth === 'healthy' ? 'bg-green-500' : 
                systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium capitalize">{systemHealth}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recent Errors (24h)</span>
                <span>{recentErrors.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Database Health</span>
                <span className="text-green-600">Good</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>API Response Time</span>
                <span>{performance?.apiResponseTime?.toFixed(0) || 0}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Error Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentErrors.length > 0 ? (
                recentErrors.map((error, index) => (
                  <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <div className="font-medium text-red-800">{error.error_type}</div>
                    <div className="text-red-600 truncate">{error.message}</div>
                    <div className="text-xs text-red-500">
                      {new Date(error.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No recent errors</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Statistics */}
      {marketplaceStats && (
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-blue">{marketplaceStats.registered_users}</div>
                <div className="text-sm text-gray-600">Registered Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-green">{marketplaceStats.listed_coins}</div>
                <div className="text-sm text-gray-600">Listed Coins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-purple">{marketplaceStats.active_auctions}</div>
                <div className="text-sm text-gray-600">Active Auctions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-orange">${marketplaceStats.total_volume}</div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{marketplaceStats.weekly_transactions}</div>
                <div className="text-sm text-gray-600">Weekly Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMonitoring;
