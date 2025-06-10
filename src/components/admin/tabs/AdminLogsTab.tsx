
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ScrollText, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Search,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';

const AdminLogsTab = () => {
  const [logType, setLogType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [severity, setSeverity] = useState('all');

  // Get error logs
  const { data: errorLogs, isLoading: errorLoading, refetch: refetchErrors } = useQuery({
    queryKey: ['admin-error-logs', logType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get admin activity logs
  const { data: activityLogs, isLoading: activityLoading, refetch: refetchActivity } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get console errors
  const { data: consoleLogs, isLoading: consoleLoading, refetch: refetchConsole } = useQuery({
    queryKey: ['console-errors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('console_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });

  const refreshLogs = () => {
    refetchErrors();
    refetchActivity();
    refetchConsole();
  };

  const exportLogs = (type: string) => {
    console.log(`Exporting ${type} logs`);
    // Implementation for log export
  };

  const getLogIcon = (type: string, level?: string) => {
    if (level === 'error' || type === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    if (level === 'warn' || type === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (level === 'success' || type === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  const getLogBadgeVariant = (type: string, level?: string) => {
    if (level === 'error' || type === 'error') return 'destructive';
    if (level === 'warn' || type === 'warning') return 'secondary';
    if (level === 'success' || type === 'success') return 'default';
    return 'outline';
  };

  const filteredErrorLogs = errorLogs?.filter(log => 
    searchTerm === '' || 
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.error_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredActivityLogs = activityLogs?.filter(log => 
    searchTerm === '' || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredConsoleLogs = consoleLogs?.filter(log => 
    searchTerm === '' || 
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Logs</h3>
          <p className="text-sm text-muted-foreground">Monitor system activity, errors, and admin actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => exportLogs('all')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Log Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Log Type</label>
              <Select value={logType} onValueChange={setLogType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  <SelectItem value="errors">Error Logs</SelectItem>
                  <SelectItem value="activity">Admin Activity</SelectItem>
                  <SelectItem value="console">Console Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      {(logType === 'all' || logType === 'errors') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Error Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errorLoading ? (
                <div className="text-center py-8">Loading error logs...</div>
              ) : filteredErrorLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No error logs found
                </div>
              ) : (
                filteredErrorLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getLogIcon('error')}
                        <Badge variant={getLogBadgeVariant('error')}>
                          {log.error_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-medium">{log.message}</div>
                      {log.page_url && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Page: {log.page_url}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Activity Logs */}
      {(logType === 'all' || logType === 'activity') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Admin Activity Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLoading ? (
                <div className="text-center py-8">Loading activity logs...</div>
              ) : filteredActivityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </div>
              ) : (
                filteredActivityLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getLogIcon('info')}
                        <Badge variant="outline">
                          {log.action}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-medium">
                        Action: {log.action} on {log.target_type}
                      </div>
                      {log.details && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Details: {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Console Error Logs */}
      {(logType === 'all' || logType === 'console') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Console Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consoleLoading ? (
                <div className="text-center py-8">Loading console logs...</div>
              ) : filteredConsoleLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No console errors found
                </div>
              ) : (
                filteredConsoleLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getLogIcon('warning', log.error_level)}
                        <Badge variant={getLogBadgeVariant('warning', log.error_level)}>
                          {log.error_level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-medium">{log.message}</div>
                      {log.source_file && (
                        <div className="text-sm text-muted-foreground mt-1">
                          File: {log.source_file}
                          {log.line_number && `:${log.line_number}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminLogsTab;
