
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, XCircle, AlertCircle } from 'lucide-react';
import { useErrorLogs, useConsoleErrors } from '@/hooks/useAdminData';

const AdminErrorMonitoringTab = () => {
  const { data: errorLogs = [], isLoading: errorLogsLoading } = useErrorLogs();
  const { data: consoleErrors = [], isLoading: consoleErrorsLoading } = useConsoleErrors();

  const getErrorSeverityBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'warn':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const stats = {
    totalErrors: errorLogs.length,
    consoleErrors: consoleErrors.length,
    criticalErrors: errorLogs.filter(e => e.error_type === 'critical').length,
    todayErrors: errorLogs.filter(e => {
      const today = new Date().toDateString();
      return new Date(e.created_at || '').toDateString() === today;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Console Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.consoleErrors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.criticalErrors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayErrors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Application Error Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorLogsLoading ? (
            <div>Loading error logs...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Page URL</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>
                      <Badge variant="destructive">{error.error_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" title={error.message}>
                        {error.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={error.page_url || 'N/A'}>
                        {error.page_url || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{error.user_id ? 'Authenticated' : 'Anonymous'}</TableCell>
                    <TableCell>
                      {error.created_at ? new Date(error.created_at).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Console Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Console Error Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consoleErrorsLoading ? (
            <div>Loading console errors...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source File</TableHead>
                  <TableHead>Line</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consoleErrors.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>{getErrorSeverityBadge(error.error_level)}</TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" title={error.message}>
                        {error.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={error.source_file || 'N/A'}>
                        {error.source_file || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{error.line_number || 'N/A'}</TableCell>
                    <TableCell>
                      {error.created_at ? new Date(error.created_at).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorMonitoringTab;
