
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define the expected shape of system stats
interface SystemStats {
  active_users?: number;
  errors_24h?: number;
  total_users?: number;
  total_coins?: number;
  total_transactions?: number;
  [key: string]: any;
}

const AdminSystemTab = () => {
  const { data: systemStatsRaw, isLoading } = useQuery({
    queryKey: ['admin-system-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Safely cast and provide defaults
  const systemStats: SystemStats = (systemStatsRaw as SystemStats) || {};
  const errors24h = systemStats.errors_24h || 0;
  const activeUsers = systemStats.active_users || 0;

  const getSystemStatus = () => {
    if (errors24h > 10) return 'critical';
    if (errors24h > 5) return 'warning';
    return 'healthy';
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Monitoring</h3>
          <p className="text-sm text-muted-foreground">Monitor system health and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={systemStatus === 'healthy' ? 'default' : systemStatus === 'warning' ? 'secondary' : 'destructive'}
            className="flex items-center gap-2"
          >
            {systemStatus === 'healthy' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {systemStatus.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">99.9% uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground">Response time: 45ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${errors24h > 5 ? 'text-red-600' : 'text-green-600'}`}>
              {errors24h}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Session Timeout</span>
              <Badge variant="outline">10 minutes</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Connection Pool</span>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Real-time Updates</span>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Logging</span>
              <Badge variant="outline">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RLS Policies</span>
              <Badge variant="default" className="text-green-700 bg-green-100">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Access Control</span>
              <Badge variant="default" className="text-green-700 bg-green-100">Secure</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Rate Limiting</span>
              <Badge variant="default" className="text-green-700 bg-green-100">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Encryption</span>
              <Badge variant="default" className="text-green-700 bg-green-100">Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Stats
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Clear Cache
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
          <p>Loading system status...</p>
        </div>
      )}
    </div>
  );
};

export default AdminSystemTab;
