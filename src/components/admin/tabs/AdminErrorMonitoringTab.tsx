
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, XCircle, AlertCircle, Activity, Lightbulb, Bell } from 'lucide-react';
import { useErrorLogs, useConsoleErrors } from '@/hooks/admin';
import ErrorTrendAnalytics from '../enhanced/ErrorTrendAnalytics';
import RealTimeErrorMonitor from '../enhanced/RealTimeErrorMonitor';
import ErrorNotificationCenter from '../enhanced/ErrorNotificationCenter';
import ErrorResolutionSuggestions from '../enhanced/ErrorResolutionSuggestions';

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
      <div>
        <h3 className="text-lg font-semibold">Error Monitoring & Resolution System</h3>
        <p className="text-sm text-muted-foreground">
          Comprehensive error tracking, real-time monitoring, and AI-powered resolution suggestions
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="real-time" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Error Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

          {/* Quick Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeErrorMonitor />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Run Error Analysis</span>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Analyze recent error patterns and get AI suggestions
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Export Error Report</span>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Generate comprehensive error report for stakeholders
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Configure Alerts</span>
                      <Badge variant="outline">Setup</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Set up email/Slack notifications for critical errors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="real-time">
          <RealTimeErrorMonitor />
        </TabsContent>

        <TabsContent value="trends">
          <ErrorTrendAnalytics />
        </TabsContent>

        <TabsContent value="suggestions">
          <ErrorResolutionSuggestions />
        </TabsContent>

        <TabsContent value="notifications">
          <ErrorNotificationCenter />
        </TabsContent>

        <TabsContent value="logs">
          <div className="space-y-6">
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
                  <div className="space-y-3">
                    {errorLogs.slice(0, 10).map((error) => (
                      <div key={error.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="destructive">{error.error_type}</Badge>
                              {error.created_at && (
                                <span className="text-xs text-gray-500">
                                  {new Date(error.created_at).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{error.message}</p>
                            {error.page_url && (
                              <p className="text-xs text-gray-500 font-mono">{error.page_url}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-3">
                    {consoleErrors.slice(0, 10).map((error) => (
                      <div key={error.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getErrorSeverityBadge(error.error_level)}
                              {error.created_at && (
                                <span className="text-xs text-gray-500">
                                  {new Date(error.created_at).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{error.message}</p>
                            {error.source_file && (
                              <p className="text-xs text-gray-500 font-mono">
                                {error.source_file}:{error.line_number || 'Unknown'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminErrorMonitoringTab;
