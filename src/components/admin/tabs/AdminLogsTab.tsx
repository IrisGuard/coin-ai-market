
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, AlertCircle, Info, CheckCircle, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLogsTab = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [consoleErrors, setConsoleErrors] = useState([]);
  const [stats, setStats] = useState({
    totalErrors: 0,
    recentErrors: 0,
    adminActions: 0,
    consoleErrors: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      const [errorRes, adminRes, consoleRes] = await Promise.all([
        supabase.from('error_logs').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('admin_activity_logs').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('console_errors').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      setErrorLogs(errorRes.data || []);
      setAdminLogs(adminRes.data || []);
      setConsoleErrors(consoleRes.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [errorRes, adminRes, consoleRes] = await Promise.all([
        supabase.from('error_logs').select('created_at'),
        supabase.from('admin_activity_logs').select('created_at'),
        supabase.from('console_errors').select('created_at')
      ]);

      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const totalErrors = errorRes.data?.length || 0;
      const recentErrors = errorRes.data?.filter(e => new Date(e.created_at) > yesterday).length || 0;
      const adminActions = adminRes.data?.length || 0;
      const consoleErrorsCount = consoleRes.data?.length || 0;

      setStats({
        totalErrors,
        recentErrors,
        adminActions,
        consoleErrors: consoleErrorsCount
      });
    } catch (error) {
      console.error('Error fetching log stats:', error);
    }
  };

  const filteredErrorLogs = errorLogs.filter(log => 
    log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.error_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.page_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getErrorLevelColor = (level) => {
    switch (level) {
      case 'error': return 'bg-red-600';
      case 'warn': return 'bg-yellow-600';
      case 'info': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Log Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
            <p className="text-xs text-muted-foreground">All recorded errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.recentErrors}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.adminActions}</div>
            <p className="text-xs text-muted-foreground">Admin activity logs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Console Errors</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.consoleErrors}</div>
            <p className="text-xs text-muted-foreground">Frontend errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search error logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchLogs}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredErrorLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-red-600">{log.error_type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-medium mb-1">{log.message}</div>
                  {log.page_url && (
                    <div className="text-sm text-muted-foreground">
                      Page: {log.page_url}
                    </div>
                  )}
                  {log.user_agent && (
                    <div className="text-sm text-muted-foreground truncate">
                      User Agent: {log.user_agent}
                    </div>
                  )}
                  {log.stack_trace && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">Stack Trace</summary>
                      <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                        {log.stack_trace}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Admin Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adminLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{log.action}</div>
                  <div className="text-sm text-muted-foreground">
                    Target: {log.target_type}
                    {log.target_id && ` (${log.target_id})`}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Console Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Console Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consoleErrors.slice(0, 10).map((error) => (
              <div key={error.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getErrorLevelColor(error.error_level)}>
                      {error.error_level?.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{error.message}</span>
                  </div>
                  {error.source_file && (
                    <div className="text-sm text-muted-foreground">
                      {error.source_file}:{error.line_number}:{error.column_number}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(error.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogsTab;
