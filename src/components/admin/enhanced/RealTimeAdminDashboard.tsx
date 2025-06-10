
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Users, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

interface RealTimeMetrics {
  active_users: number;
  active_sessions: number;
  pending_transactions: number;
  system_alerts: number;
  performance_score: number;
  last_updated: string;
}

const RealTimeAdminDashboard = () => {
  const [isLive, setIsLive] = useState(false);
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    active_users: 0,
    active_sessions: 0,
    pending_transactions: 0,
    system_alerts: 0,
    performance_score: 95,
    last_updated: new Date().toISOString()
  });

  // Real-time metrics query
  const { data: liveMetrics, refetch } = useQuery({
    queryKey: ['real-time-admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_real_time_admin_metrics');
      if (error) throw error;
      return data as RealTimeMetrics;
    },
    refetchInterval: isLive ? 5000 : false,
    enabled: isLive
  });

  useEffect(() => {
    if (liveMetrics) {
      setMetrics(liveMetrics);
    }
  }, [liveMetrics]);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
    if (!isLive) {
      refetch();
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Real-time Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Real-Time Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Live system monitoring and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? 'default' : 'secondary'} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'LIVE' : 'OFFLINE'}
          </Badge>
          <Button 
            variant={isLive ? 'destructive' : 'default'} 
            size="sm" 
            onClick={toggleLiveMode}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isLive ? 'Stop Live' : 'Go Live'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.active_users}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently online</p>
            {isLive && (
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.active_sessions}</div>
            <p className="text-xs text-muted-foreground mt-1">Current sessions</p>
            {isLive && (
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{metrics.pending_transactions}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
            {isLive && (
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{metrics.system_alerts}</div>
            <p className="text-xs text-muted-foreground mt-1">Active alerts</p>
            {isLive && (
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium">Overall Performance Score</div>
              <div className="text-xs text-muted-foreground">Last updated: {new Date(metrics.last_updated).toLocaleTimeString()}</div>
            </div>
            <div className={`text-4xl font-bold ${getPerformanceColor(metrics.performance_score)}`}>
              {metrics.performance_score}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                metrics.performance_score >= 90 ? 'bg-green-500' :
                metrics.performance_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.performance_score}%` }}
            />
          </div>

          {isLive && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Real-time monitoring active
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAdminDashboard;
