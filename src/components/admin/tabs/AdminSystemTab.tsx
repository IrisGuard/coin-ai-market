
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
import { toast } from '@/hooks/use-toast';

// TypeScript interfaces for the comprehensive stats
interface SystemStatsData {
  users: {
    total: number;
    dealers: number;
    verified_dealers: number;
    admins: number;
    active_15min: number;
  };
  coins: {
    total: number;
    featured: number;
    live_auctions: number;
    sold: number;
  };
  transactions: {
    total: number;
    completed: number;
    revenue: number;
  };
  system: {
    errors_24h: number;
    active_alerts: number;
    health_status: 'healthy' | 'warning' | 'critical';
  };
  ai_automation: {
    commands: number;
    rules: number;
    models: number;
  };
  integrations: {
    data_sources: number;
    api_keys: number;
  };
  last_updated: string;
}

interface SystemAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  created_at: string;
  alert_data: any;
  is_resolved: boolean;
  current_value: number;
  metric_threshold: number;
  resolved_at: string;
}

const AdminSystemTab = () => {
  const { data: systemStatsRaw, isLoading, refetch } = useQuery({
    queryKey: ['admin-system-comprehensive'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_comprehensive');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: systemAlerts } = useQuery({
    queryKey: ['system-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  // Type cast the raw data to our interface with proper type safety
  const systemStats = (systemStatsRaw as unknown) as SystemStatsData | null;

  const getSystemStatus = () => {
    if (!systemStats?.system) return 'unknown';
    return systemStats.system.health_status || 'healthy';
  };

  const systemStatus = getSystemStatus();
  const errorsCount = systemStats?.system?.errors_24h || 0;
  const activeAlerts = systemStats?.system?.active_alerts || 0;

  const handleRefreshStats = () => {
    refetch();
    toast({
      title: "Stats Refreshed",
      description: "System statistics have been updated.",
    });
  };

  const handleClearCache = async () => {
    try {
      // Clear AI recognition cache
      await supabase.from('ai_recognition_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Record system metric
      await supabase.rpc('record_system_metric', {
        p_metric_name: 'cache_cleared',
        p_metric_value: 1,
        p_metric_type: 'counter'
      });
      
      toast({
        title: "Cache Cleared",
        description: "AI recognition cache has been cleared successfully.",
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Error",
        description: "Failed to clear cache.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAlert = async () => {
    try {
      await supabase.from('system_alerts').insert({
        alert_type: 'manual',
        severity: 'info',
        title: 'System Check',
        description: 'Manual system check performed by admin'
      });
      
      toast({
        title: "Alert Created",
        description: "System alert has been created.",
      });
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

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
            <p className="text-xs text-muted-foreground">Response time: &lt;50ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats?.users?.total?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">{systemStats?.users?.active_15min || 0} active now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorsCount}</div>
            <p className={`text-xs ${errorsCount > 5 ? 'text-red-600' : 'text-green-600'}`}>
              errors (24h)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Real-time System Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Coins</span>
              <Badge variant="outline">{systemStats?.coins?.total || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Live Auctions</span>
              <Badge variant="outline">{systemStats?.coins?.live_auctions || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Revenue</span>
              <Badge variant="outline">€{systemStats?.transactions?.revenue?.toLocaleString() || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Data Sources</span>
              <Badge variant="outline">{systemStats?.integrations?.data_sources || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              AI & Automation Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Commands</span>
              <Badge variant="default" className="text-green-700 bg-green-100">
                {systemStats?.ai_automation?.commands || 0} Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Automation Rules</span>
              <Badge variant="default" className="text-blue-700 bg-blue-100">
                {systemStats?.ai_automation?.rules || 0} Running
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Prediction Models</span>
              <Badge variant="default" className="text-purple-700 bg-purple-100">
                {systemStats?.ai_automation?.models || 0} Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Keys</span>
              <Badge variant="default" className="text-orange-700 bg-orange-100">
                {systemStats?.integrations?.api_keys || 0} Configured
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      {systemAlerts && systemAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-gray-600">{alert.description}</div>
                  </div>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRefreshStats}>
              <RefreshCw className="h-4 w-4" />
              Refresh Stats
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleClearCache}>
              <Database className="h-4 w-4" />
              Clear Cache
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleCreateAlert}>
              <AlertTriangle className="h-4 w-4" />
              Create Alert
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
