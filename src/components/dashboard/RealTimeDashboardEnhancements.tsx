import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, Activity, TrendingUp, Shield, 
  Users, Coins, Zap, AlertTriangle 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealTimeStatusIndicator, PhaseStatusComponent } from '../ui/AdvancedUIComponents';

const RealTimeDashboardEnhancements = () => {
  const [isLive, setIsLive] = useState(true);

  // Phase 7: Real-time system metrics
  const { data: systemMetrics } = useQuery({
    queryKey: ['phase7-system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000
  });

  // Phase 7: Security incidents monitoring
  const { data: securityIncidents } = useQuery({
    queryKey: ['phase7-security-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000
  });

  // Phase 7: Performance analytics
  const { data: performanceData } = useQuery({
    queryKey: ['phase7-performance-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000
  });

  // Phase 7: Error monitoring
  const { data: errorLogs } = useQuery({
    queryKey: ['phase7-error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 8000
  });

  // Phase 7: Admin activity monitoring
  const { data: adminActivity } = useQuery({
    queryKey: ['phase7-admin-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 12000
  });

  const getSystemHealthStatus = () => {
    const criticalErrors = errorLogs?.filter(log => log.error_type === 'critical').length || 0;
    const securityIssues = securityIncidents?.filter(incident => incident.severity_level === 'critical').length || 0;
    
    if (criticalErrors > 0 || securityIssues > 0) return 'critical';
    if (errorLogs?.length > 5) return 'warning';
    return 'healthy';
  };

  return (
    <div className="space-y-6">
      {/* Phase 7: Real-time Dashboard Header */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-green-600" />
              Real-time Dashboard Enhancements
              <Badge className="bg-green-100 text-green-800">Phase 7 Live</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-muted-foreground">
                {isLive ? 'Live Updates' : 'Paused'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {systemMetrics?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">System Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {errorLogs?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Error Logs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {securityIncidents?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Security Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {performanceData?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {adminActivity?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Admin Actions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RealTimeStatusIndicator
              systemName="Platform Health"
              status={getSystemHealthStatus()}
              metrics={[
                { name: 'Uptime', value: '99.9%' },
                { name: 'Response', value: '<200ms' },
                { name: 'Errors', value: errorLogs?.length || 0 },
                { name: 'Users', value: '245' }
              ]}
            />
            
            <RealTimeStatusIndicator
              systemName="AI Systems"
              status="healthy"
              metrics={[
                { name: 'Recognition', value: '98.5%' },
                { name: 'Analysis', value: '456' },
                { name: 'Cache Hit', value: '89%' },
                { name: 'Latency', value: '120ms' }
              ]}
            />
            
            <PhaseStatusComponent />
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData?.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{metric.metric_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {metric.metric_type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{metric.metric_value}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(metric.recorded_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics?.slice(0, 5).map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{metric.metric_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {metric.metric_type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{metric.metric_value}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(metric.recorded_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityIncidents?.length > 0 ? (
                  securityIncidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{incident.title}</div>
                        <Badge 
                          className={`${
                            incident.severity_level === 'critical' ? 'bg-red-100 text-red-800' :
                            incident.severity_level === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {incident.severity_level}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {incident.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(incident.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div>No security incidents</div>
                    <div className="text-sm">System is secure</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Error Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorLogs?.length > 0 ? (
                  errorLogs.map((error) => (
                    <div key={error.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{error.error_type}</div>
                        <Badge variant="destructive">Error</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {error.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(error.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div>No recent errors</div>
                    <div className="text-sm">System running smoothly</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Admin Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">
                        Target: {activity.target_type}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Admin</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeDashboardEnhancements;