import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Activity,
  Eye,
  Target,
  Zap,
  Lock
} from 'lucide-react';

const Phase6SecurityMonitor = () => {
  // Console Errors for Security Monitoring
  const { data: consoleErrors } = useQuery({
    queryKey: ['phase6-security-console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Analytics Events for Security Analysis
  const { data: securityEvents } = useQuery({
    queryKey: ['phase6-security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .or('event_type.ilike.%security%,event_type.ilike.%auth%,event_type.ilike.%login%,event_type.ilike.%error%')
        .order('timestamp', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // Admin Activity Logs for Security Audit
  const { data: adminLogs } = useQuery({
    queryKey: ['phase6-admin-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  // API Keys Status
  const { data: apiKeys } = useQuery({
    queryKey: ['phase6-api-keys-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, key_name, is_active, created_at, updated_at')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000
  });

  // Calculate security metrics
  const criticalErrors = consoleErrors?.filter(error => 
    error.error_level === 'error' || error.error_level === 'critical'
  ).length || 0;

  const securityAlerts = securityEvents?.length || 0;
  const adminActivities = adminLogs?.length || 0;
  const activeKeys = apiKeys?.filter(key => key.is_active).length || 0;

  // Error severity distribution
  const errorSeverity = consoleErrors?.reduce((acc, error) => {
    acc[error.error_level] = (acc[error.error_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Security event types
  const securityEventTypes = securityEvents?.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Recent admin actions
  const adminActionTypes = adminLogs?.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Monitoring Center</h2>
          <p className="text-muted-foreground">Real-time security monitoring and threat detection</p>
        </div>
        <Badge className="bg-red-100 text-red-800">Live Security Monitor</Badge>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${criticalErrors > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {criticalErrors}
            </div>
            <p className="text-xs text-muted-foreground">High severity issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{securityAlerts}</div>
            <p className="text-xs text-muted-foreground">Security-related events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Activities</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{adminActivities}</div>
            <p className="text-xs text-muted-foreground">Administrative actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
            <Lock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeKeys}</div>
            <p className="text-xs text-muted-foreground">Keys in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Severity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            Error Severity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(errorSeverity).map(([level, count]) => (
              <div key={level} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {level === 'error' || level === 'critical' ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : level === 'warn' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="font-medium capitalize">{level}</span>
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">occurrences</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Events Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Security Event Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(securityEventTypes).map(([type, count]) => (
              <div key={type} className="p-3 border rounded-lg">
                <div className="font-medium text-sm capitalize mb-1">
                  {type.replace(/_/g, ' ')}
                </div>
                <div className="text-xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">events</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Critical Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Recent Critical Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {consoleErrors
              ?.filter(error => error.error_level === 'error' || error.error_level === 'critical')
              .slice(0, 10)
              .map((error) => (
                <div key={error.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive">{error.error_level}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {new Date(error.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-1">
                    {error.message}
                  </div>
                  {error.source_file && (
                    <div className="text-xs text-muted-foreground">
                      File: {error.source_file}
                      {error.line_number && `:${error.line_number}`}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Activity Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Admin Activity Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Action Types Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {Object.entries(adminActionTypes).map(([action, count]) => (
                <div key={action} className="p-2 border rounded">
                  <div className="text-sm font-medium capitalize">
                    {action.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-bold">{count}</div>
                </div>
              ))}
            </div>
            
            {/* Recent Activities */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {adminLogs?.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {log.action.replace(/_/g, ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Target: {log.target_type}
                      {log.ip_address && ` • IP: ${log.ip_address}`}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            API Keys Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiKeys?.slice(0, 10).map((key) => (
              <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{key.key_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(key.created_at).toLocaleDateString()}
                    {key.updated_at !== key.created_at && (
                      <span> • Updated: {new Date(key.updated_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <Badge variant={key.is_active ? 'default' : 'secondary'}>
                  {key.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase6SecurityMonitor;