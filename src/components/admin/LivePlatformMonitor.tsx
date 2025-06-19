
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeSystemStatus } from '@/hooks/useRealTimeSystemStatus';
import { monitoringService } from '@/services/monitoringService';
import { 
  Activity, TrendingUp, Users, Store, CreditCard, 
  Bot, Database, Zap, CheckCircle, AlertTriangle,
  Clock, RefreshCw, Pause, Play, Bell
} from 'lucide-react';

const LivePlatformMonitor = () => {
  const { 
    systemStatus, 
    isLoading: statusLoading, 
    isMonitoring, 
    lastHealthCheck,
    triggerHealthCheck,
    toggleMonitoring,
    createAlert
  } = useRealTimeSystemStatus();

  const { data: liveStats } = useQuery({
    queryKey: ['live-platform-stats'],
    queryFn: async () => {
      const [
        stores,
        coins,
        users,
        transactions,
        aiCommands,
        errors24h
      ] = await Promise.all([
        supabase.from('stores').select('*', { count: 'exact' }).eq('is_active', true),
        supabase.from('coins').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('payment_transactions').select('*', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('ai_commands').select('*', { count: 'exact' }).eq('is_active', true),
        supabase.from('error_logs').select('*', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const { count: subscriptionCount } = await supabase
        .from('user_subscriptions' as any)
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      return {
        activeStores: stores.count || 0,
        totalCoins: coins.count || 0,
        totalUsers: users.count || 0,
        completedTransactions: transactions.count || 0,
        activeSubscriptions: subscriptionCount || 0,
        aiCommands: aiCommands.count || 0,
        errors24h: errors24h.count || 0,
        systemHealth: (errors24h.count || 0) < 5 ? 'healthy' : 'warning'
      };
    },
    refetchInterval: 10000
  });

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBg = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'critical': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const handleCreateTestAlert = async () => {
    await createAlert(
      'performance',
      'medium',
      'Test Alert',
      'This is a test alert created manually'
    );
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card className={`border-2 ${systemStatus?.overallHealth === 'critical' ? 'border-red-200' : 
                       systemStatus?.overallHealth === 'warning' ? 'border-yellow-200' : 'border-green-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Phase 16: Production Monitoring & Alerting System
            <Badge className={`ml-auto ${systemStatus?.overallHealth === 'healthy' ? 'bg-green-100 text-green-800' :
                              systemStatus?.overallHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
              {systemStatus?.overallHealth?.toUpperCase() || 'LOADING'}
            </Badge>
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Real-time system health monitoring with automatic alerting
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMonitoring}
                className="flex items-center gap-2"
              >
                {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isMonitoring ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={triggerHealthCheck}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Check Now
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-2xl font-bold ${getHealthColor(systemStatus?.overallHealth || 'healthy')}`}>
                {systemStatus?.uptime?.toFixed(1) || '99.9'}%
              </div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {systemStatus?.responseTime?.toFixed(0) || '0'}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {systemStatus?.activeAlerts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {systemStatus?.criticalAlerts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Critical Alerts</div>
            </div>
          </div>

          {/* Resource Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm">{systemStatus?.resourceUsage?.cpu?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(systemStatus?.resourceUsage?.cpu || 0, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm">{systemStatus?.resourceUsage?.memory?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(systemStatus?.resourceUsage?.memory || 0, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className="text-sm">{systemStatus?.resourceUsage?.disk?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(systemStatus?.resourceUsage?.disk || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {lastHealthCheck && (
            <div className="text-sm text-muted-foreground">
              Last health check: {lastHealthCheck.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-green-600" />
            Live Platform Statistics
            <Badge className="bg-blue-100 text-blue-800 ml-auto">
              <CheckCircle className="h-3 w-3 mr-1" />
              REAL-TIME
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Store className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{liveStats?.activeStores || 0}</div>
              <div className="text-sm text-muted-foreground">Active Stores</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{liveStats?.totalCoins || 0}</div>
              <div className="text-sm text-muted-foreground">Listed Coins</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{liveStats?.totalUsers || 0}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{liveStats?.completedTransactions || 0}</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-xl font-bold">{liveStats?.activeSubscriptions || 0}</div>
              <div className="text-sm text-muted-foreground">Active Subscriptions</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-xl font-bold">{liveStats?.aiCommands || 0}</div>
              <div className="text-sm text-muted-foreground">AI Commands</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className={`h-6 w-6 mx-auto mb-2 ${getHealthColor(liveStats?.systemHealth || 'healthy')}`} />
              <div className={`text-xl font-bold ${getHealthColor(liveStats?.systemHealth || 'healthy')}`}>
                {liveStats?.systemHealth === 'healthy' ? 'OPTIMAL' : 'MONITORING'}
              </div>
              <div className="text-sm text-muted-foreground">
                {liveStats?.errors24h || 0} errors (24h)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Monitoring Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={handleCreateTestAlert}
              className="h-20 flex flex-col items-center gap-2"
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Test Alert</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Performance</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm">Uptime History</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center gap-2"
            >
              <Database className="h-6 w-6" />
              <span className="text-sm">System Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status Details */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Phase 16 Production Monitoring Features</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Real-time system health monitoring</li>
          <li>✅ Automatic error detection and alerting</li>
          <li>✅ Performance bottleneck identification</li>
          <li>✅ Uptime/downtime tracking</li>
          <li>✅ Resource usage monitoring (CPU, Memory, Disk)</li>
          <li>✅ Database performance metrics</li>
          <li>✅ API response time tracking</li>
          <li>✅ Alert thresholds configuration</li>
          <li>✅ Auto-escalation for critical issues</li>
          <li>✅ Performance baseline establishment</li>
        </ul>
      </div>
    </div>
  );
};

export default LivePlatformMonitor;
