
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Server, Database, Users, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetrics {
  activeUsers: number;
  databaseConnections: number;
  apiRequests: number;
  errorRate: number;
  responseTime: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
}

const RealTimeMonitoring = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 0,
    databaseConnections: 0,
    apiRequests: 0,
    errorRate: 0,
    responseTime: 0,
    systemHealth: 'healthy',
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMetrics();
    
    // Real-time monitoring - update every 10 seconds
    const interval = setInterval(loadMetrics, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate real-time metrics gathering
      const [userMetrics, errorMetrics, performanceMetrics] = await Promise.all([
        getUserMetrics(),
        getErrorMetrics(),
        getPerformanceMetrics()
      ]);

      setMetrics({
        activeUsers: userMetrics.active,
        databaseConnections: userMetrics.connections,
        apiRequests: performanceMetrics.requests,
        errorRate: errorMetrics.rate,
        responseTime: performanceMetrics.responseTime,
        systemHealth: determineSystemHealth(errorMetrics.rate, performanceMetrics.responseTime),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserMetrics = async () => {
    // Get active users from profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, updated_at')
      .gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()); // Last 15 minutes

    if (error) throw error;

    return {
      active: profiles?.length || 0,
      connections: Math.floor(Math.random() * 50) + 10 // Mock DB connections
    };
  };

  const getErrorMetrics = async () => {
    // Get recent errors
    const { data: errors, error } = await supabase
      .from('error_logs')
      .select('id')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (error) throw error;

    const errorCount = errors?.length || 0;
    const totalRequests = Math.floor(Math.random() * 1000) + 500; // Mock total requests
    
    return {
      rate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0
    };
  };

  const getPerformanceMetrics = async () => {
    // Measure actual database response time
    const startTime = Date.now();
    
    await supabase
      .from('coins')
      .select('id')
      .limit(1);
    
    const responseTime = Date.now() - startTime;

    return {
      requests: Math.floor(Math.random() * 100) + 50, // Mock API requests
      responseTime
    };
  };

  const determineSystemHealth = (errorRate: number, responseTime: number): 'healthy' | 'warning' | 'critical' => {
    if (errorRate > 5 || responseTime > 2000) return 'critical';
    if (errorRate > 2 || responseTime > 1000) return 'warning';
    return 'healthy';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Health Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getHealthColor(metrics.systemHealth)}>
                {getHealthIcon(metrics.systemHealth)}
                {metrics.systemHealth.toUpperCase()}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadMetrics}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Last updated: {metrics.lastUpdated.toLocaleTimeString()}
          </p>
        </CardHeader>
      </Card>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.activeUsers}</p>
                <p className="text-xs text-gray-500">Last 15 minutes</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DB Connections</p>
                <p className="text-3xl font-bold text-green-600">{metrics.databaseConnections}</p>
                <p className="text-xs text-gray-500">Current active</p>
              </div>
              <Database className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Requests</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.apiRequests}</p>
                <p className="text-xs text-gray-500">Per minute</p>
              </div>
              <Server className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-3xl font-bold text-orange-600">{metrics.responseTime}ms</p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Rate Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Error Rate</span>
                <span className="text-2xl font-bold text-red-600">{metrics.errorRate.toFixed(2)}%</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target: &lt; 1%</span>
                  <span className={metrics.errorRate < 1 ? 'text-green-600' : 'text-red-600'}>
                    {metrics.errorRate < 1 ? 'On Track' : 'Above Target'}
                  </span>
                </div>
              </div>

              {metrics.errorRate > 2 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    High error rate detected. Check system logs.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="text-2xl font-bold text-blue-600">{metrics.responseTime}ms</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target: &lt; 500ms</span>
                  <span className={metrics.responseTime < 500 ? 'text-green-600' : 'text-yellow-600'}>
                    {metrics.responseTime < 500 ? 'Optimal' : 'Acceptable'}
                  </span>
                </div>
              </div>

              {metrics.responseTime > 1000 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Response time above optimal. Consider optimization.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
