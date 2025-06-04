
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, RefreshCw, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockApi } from '@/lib/mockApi';
import { toast } from '@/hooks/use-toast';

interface ErrorLog {
  id: string;
  error_type: string;
  message: string;
  stack_trace: string | null;
  user_id: string | null;
  page_url: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ConsoleError {
  id: string;
  error_level: string;
  message: string;
  source_file: string | null;
  line_number: number | null;
  column_number: number | null;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
}

const AdminErrorMonitoringTab = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [consoleErrors, setConsoleErrors] = useState<ConsoleError[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorTypeFilter, setErrorTypeFilter] = useState('all');
  const [errorLevelFilter, setErrorLevelFilter] = useState('all');

  const fetchErrorLogs = async () => {
    try {
      // Mock error logs
      const mockErrorLogs = [
        {
          id: '1',
          error_type: 'runtime',
          message: 'Cannot read property of undefined',
          stack_trace: 'Error: Cannot read property...\n  at Component.render',
          user_id: 'user1',
          page_url: '/coins/123',
          user_agent: 'Mozilla/5.0...',
          created_at: new Date().toISOString()
        }
      ];
      
      setErrorLogs(mockErrorLogs);
    } catch (error) {
      console.error('Error fetching error logs:', error);
      setErrorLogs([]);
    }
  };

  const fetchConsoleErrors = async () => {
    try {
      // Mock console errors
      const mockConsoleErrors = [
        {
          id: '1',
          error_level: 'error',
          message: 'Failed to load resource',
          source_file: 'app.js',
          line_number: 123,
          column_number: 45,
          user_id: 'user1',
          session_id: 'session123',
          created_at: new Date().toISOString()
        }
      ];
      
      setConsoleErrors(mockConsoleErrors);
    } catch (error) {
      console.error('Error fetching console errors:', error);
      setConsoleErrors([]);
    }
  };

  const clearErrorLogs = async () => {
    try {
      setErrorLogs([]);
      
      toast({
        title: "Success",
        description: "Error logs cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear error logs",
        variant: "destructive",
      });
    }
  };

  const clearConsoleErrors = async () => {
    try {
      setConsoleErrors([]);
      
      toast({
        title: "Success",
        description: "Console errors cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear console errors",
        variant: "destructive",
      });
    }
  };

  const refreshData = () => {
    setLoading(true);
    Promise.all([fetchErrorLogs(), fetchConsoleErrors()]).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredErrorLogs = errorLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.error_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = errorTypeFilter === 'all' || log.error_type === errorTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredConsoleErrors = consoleErrors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = errorLevelFilter === 'all' || error.error_level === errorLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const getErrorBadgeVariant = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'outline';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bug className="h-6 w-6 text-red-600" />
        <h3 className="text-lg font-semibold">Error Monitoring Dashboard</h3>
        <Button onClick={refreshData} size="sm" variant="outline" className="ml-auto">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search errors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={errorTypeFilter} onValueChange={setErrorTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="runtime">Runtime</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="authentication">Authentication</SelectItem>
          </SelectContent>
        </Select>
        <Select value={errorLevelFilter} onValueChange={setErrorLevelFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warn">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Application Errors ({filteredErrorLogs.length})
            </CardTitle>
            <Button size="sm" variant="outline" onClick={clearErrorLogs}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4">Loading error logs...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredErrorLogs.map((log) => (
                  <div key={log.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{log.error_type}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mt-1">{log.message}</div>
                    {log.page_url && (
                      <div className="text-xs text-gray-500 mt-1">
                        Page: {log.page_url}
                      </div>
                    )}
                    {log.stack_trace && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-blue-600">
                          Stack Trace
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                          {log.stack_trace}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
                
                {filteredErrorLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No error logs found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Console Errors ({filteredConsoleErrors.length})
            </CardTitle>
            <Button size="sm" variant="outline" onClick={clearConsoleErrors}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-4">Loading console errors...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredConsoleErrors.map((error) => (
                  <div key={error.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getErrorBadgeVariant(error.error_level)}>
                        {error.error_level.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(error.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mt-1">{error.message}</div>
                    {error.source_file && (
                      <div className="text-xs text-gray-500 mt-1">
                        File: {error.source_file}
                        {error.line_number && `:${error.line_number}`}
                        {error.column_number && `:${error.column_number}`}
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredConsoleErrors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No console errors found.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminErrorMonitoringTab;
