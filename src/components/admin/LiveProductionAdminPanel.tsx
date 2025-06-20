
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { emergencyActivation } from '@/services/emergencyActivationService';
import { Activity, Database, Brain, Zap, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AdminMetrics {
  totalCoins: number;
  totalUsers: number;
  activeSources: number;
  aiCommands: number;
  totalRevenue: number;
  systemHealth: string;
  errors24h: number;
  liveAuctions: number;
  systemStatus: string;
}

const LiveProductionAdminPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalCoins: 0,
    totalUsers: 0,
    activeSources: 0,
    aiCommands: 0,
    totalRevenue: 0,
    systemHealth: 'unknown',
    errors24h: 0,
    liveAuctions: 0,
    systemStatus: 'INITIALIZING'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLiveMetrics = async () => {
    try {
      setIsLoading(true);
      console.log('📊 FETCHING LIVE ADMIN METRICS');

      // Get activation status from emergency service
      const activationStatus = await emergencyActivation.getActivationStatus();

      // Get comprehensive admin dashboard data
      const { data: dashboardData, error: dashboardError } = await supabase.rpc('get_ultra_optimized_admin_dashboard');
      
      if (dashboardError) {
        console.error('Dashboard data error:', dashboardError);
      }

      // Get live coin count
      const { count: coinsCount } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true });

      // Get user count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get recent errors
      const { count: errorsCount } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get live auctions
      const { count: auctionsCount } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString());

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setMetrics({
        totalCoins: coinsCount || 0,
        totalUsers: usersCount || 0,
        activeSources: activationStatus.activeSources,
        aiCommands: activationStatus.activeAICommands,
        totalRevenue,
        systemHealth: errorsCount && errorsCount > 10 ? 'warning' : 'healthy',
        errors24h: errorsCount || 0,
        liveAuctions: auctionsCount || 0,
        systemStatus: activationStatus.systemStatus
      });

      setLastUpdated(new Date());
      console.log(`✅ ADMIN METRICS UPDATED: ${coinsCount} coins, ${activationStatus.activeSources} sources, ${activationStatus.activeAICommands} AI commands, Status: ${activationStatus.systemStatus}`);

    } catch (error) {
      console.error('Error fetching admin metrics:', error);
      toast.error('Failed to fetch live admin metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const executeEmergencyActivation = async () => {
    try {
      console.log('🚨 ADMIN EXECUTING EMERGENCY ACTIVATION');
      
      await emergencyActivation.executeFullPlatformActivation();
      toast.success('🚀 Emergency activation completed from Admin Panel!');
      fetchLiveMetrics();
    } catch (error) {
      console.error('Emergency activation error:', error);
      toast.error('Emergency activation failed - retrying...');
    }
  };

  const executeSystemOptimization = async () => {
    try {
      console.log('🔧 EXECUTING SYSTEM OPTIMIZATION');
      
      const { data, error } = await supabase.rpc('monitor_query_performance');
      
      if (!error) {
        toast.success('System optimization completed');
        fetchLiveMetrics();
      }
    } catch (error) {
      console.error('System optimization error:', error);
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULLY_OPERATIONAL': return 'text-green-600 bg-green-100';
      case 'ACTIVATING': return 'text-yellow-600 bg-yellow-100';
      case 'ERROR': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Production Admin Control Center</h1>
          <p className="text-muted-foreground">Real-time platform monitoring and emergency activation controls</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchLiveMetrics} variant="outline" size="sm">
            Refresh Data
          </Button>
          <Button onClick={executeSystemOptimization} variant="outline" size="sm">
            Optimize System
          </Button>
          <Button onClick={executeEmergencyActivation} className="bg-red-600 hover:bg-red-700" size="sm">
            🚨 Emergency Activate
          </Button>
        </div>
      </div>

      {/* Emergency Status Alert */}
      {metrics.totalCoins < 100 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800">🚨 CRITICAL: Platform Underperforming</h4>
                <p className="text-sm text-red-600">
                  Only {metrics.totalCoins} coins detected. Platform should show thousands from 16 sources.
                </p>
              </div>
              <Button onClick={executeEmergencyActivation} className="bg-red-600 hover:bg-red-700" size="sm">
                🚨 EMERGENCY ACTIVATE
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
            🔴 LIVE PRODUCTION STATUS - {metrics.systemStatus}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={`${getHealthColor(metrics.systemHealth)} px-3 py-1`}>
                SYSTEM: {metrics.systemHealth.toUpperCase()}
              </Badge>
              <Badge className={`${getStatusColor(metrics.systemStatus)} px-3 py-1`}>
                STATUS: {metrics.systemStatus}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-medium">AI Brain: {metrics.aiCommands > 0 ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className={metrics.totalCoins < 100 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <div className={`text-2xl font-bold ${metrics.totalCoins < 100 ? 'text-red-600' : 'text-blue-600'}`}>
                  {metrics.totalCoins.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Coins {metrics.totalCoins < 100 ? '(CRITICAL LOW)' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{metrics.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={metrics.activeSources < 10 ? 'border-yellow-200 bg-yellow-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <div className={`text-2xl font-bold ${metrics.activeSources < 10 ? 'text-yellow-600' : 'text-orange-600'}`}>
                  {metrics.activeSources}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Sources {metrics.activeSources < 10 ? '(LOW)' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{metrics.aiCommands}</div>
                <div className="text-sm text-muted-foreground">AI Commands</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${metrics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Platform Revenue</p>
            <div className="mt-4">
              <div className="text-lg font-semibold">{metrics.liveAuctions}</div>
              <p className="text-sm text-muted-foreground">Live Auctions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {metrics.errors24h}
            </div>
            <p className="text-sm text-muted-foreground">Errors (24h)</p>
            <Badge className={`mt-3 ${getHealthColor(metrics.systemHealth)}`}>
              {metrics.systemHealth.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Brain Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Recognition System</span>
                <Badge className={metrics.aiCommands > 0 ? "bg-green-600" : "bg-red-600"}>
                  {metrics.aiCommands > 0 ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Market Analysis</span>
                <Badge className={metrics.activeSources > 0 ? "bg-green-600" : "bg-red-600"}>
                  {metrics.activeSources > 0 ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Data Pipeline</span>
                <Badge className={metrics.systemStatus === 'FULLY_OPERATIONAL' ? "bg-green-600" : "bg-yellow-600"}>
                  {metrics.systemStatus === 'FULLY_OPERATIONAL' ? "OPERATIONAL" : "ACTIVATING"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>System Status</span>
                <Badge className={`${getStatusColor(metrics.systemStatus)}`}>
                  {metrics.systemStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveProductionAdminPanel;
