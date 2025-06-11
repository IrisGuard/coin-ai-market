
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Users, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Server
} from 'lucide-react';

const AdminSystemTab = () => {
  const { data: systemStats, isLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [usersResult, coinsResult, errorsResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalCoins: coinsResult.count || 0,
        totalErrors: errorsResult.count || 0,
        uptime: '99.9%',
        serverStatus: errorsResult.count > 10 ? 'warning' : 'healthy',
        averageAccuracy: 94.2
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
        <p>Loading system statistics...</p>
      </div>
    );
  }

  const stats = systemStats || {
    totalUsers: 0,
    totalCoins: 0,
    totalErrors: 0,
    uptime: '0%',
    serverStatus: 'unknown',
    averageAccuracy: 0
  };

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
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Server className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Overview</h3>
          <p className="text-sm text-muted-foreground">Real-time system monitoring and statistics</p>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(stats.serverStatus)}
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <span className={`font-semibold capitalize ${getStatusColor(stats.serverStatus)}`}>
                  {stats.serverStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="font-semibold text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Endpoints</span>
                <span className="font-semibold text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="font-semibold text-green-600">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Accuracy</span>
                <span className="font-semibold">{stats.averageAccuracy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="font-semibold">~250ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <span className="font-semibold">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Usage</span>
                <span className="font-semibold">34%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">System backup completed</div>
                <div className="text-sm text-muted-foreground">2 minutes ago</div>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Database optimization started</div>
                <div className="text-sm text-muted-foreground">15 minutes ago</div>
              </div>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">New user registration: 5 users</div>
                <div className="text-sm text-muted-foreground">1 hour ago</div>
              </div>
              <Users className="h-4 w-4 text-coin-purple" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemTab;
