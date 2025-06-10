
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Activity, BarChart3, Eye } from 'lucide-react';
import { useRealTimeErrors } from '@/hooks/admin/useRealTimeErrors';
import { useErrorLogs, useErrorAnalytics, useConsoleErrors } from '@/hooks/admin';
import { Badge } from '@/components/ui/badge';

const AdminErrorMonitoringTab = () => {
  const { recentErrors, isConnected } = useRealTimeErrors();
  const { data: errorLogs } = useErrorLogs();
  const { data: errorAnalytics } = useErrorAnalytics();
  const { data: consoleErrors } = useConsoleErrors();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Real-time Error Monitoring
            {isConnected && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Live</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="realtime" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="realtime" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Real-time Errors
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Error Analytics
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Error Logs
              </TabsTrigger>
              <TabsTrigger value="console" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Console Errors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {recentErrors.filter(e => e.severity === 'critical').length}
                      </div>
                      <div className="text-sm text-gray-600">Critical Errors</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {recentErrors.filter(e => e.severity === 'high').length}
                      </div>
                      <div className="text-sm text-gray-600">High Priority</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {recentErrors.filter(e => e.severity === 'medium').length}
                      </div>
                      <div className="text-sm text-gray-600">Medium Priority</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {recentErrors.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Recent</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Live Error Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentErrors.map((error) => (
                      <div key={error.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="font-medium">{error.error_type}</span>
                            <Badge className={getSeverityColor(error.severity)}>
                              {error.severity}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(error.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{error.message}</p>
                        {error.page_url && (
                          <p className="text-xs text-gray-500">Page: {error.page_url}</p>
                        )}
                      </div>
                    ))}
                    {recentErrors.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No recent errors detected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Error Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Critical Errors (24h)</span>
                        <span className="font-bold text-red-600">
                          {errorAnalytics?.critical_24h || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Error Rate (%)</span>
                        <span className="font-bold text-orange-600">
                          {errorAnalytics?.error_rate || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Resolution Time (avg)</span>
                        <span className="font-bold text-blue-600">
                          {errorAnalytics?.avg_resolution_time || 0}min
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Error Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {errorAnalytics?.categories?.map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{category.type}</span>
                          <Badge variant="outline">{category.count}</Badge>
                        </div>
                      )) || (
                        <div className="text-center text-gray-500">No category data</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Error Logs History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Time</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Message</th>
                          <th className="text-left p-2">Page</th>
                          <th className="text-left p-2">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {errorLogs?.map((log) => (
                          <tr key={log.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 text-sm">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td className="p-2">
                              <Badge variant="outline">{log.error_type}</Badge>
                            </td>
                            <td className="p-2 text-sm max-w-xs truncate">
                              {log.message}
                            </td>
                            <td className="p-2 text-sm">{log.page_url || 'N/A'}</td>
                            <td className="p-2 text-sm">{log.user_id || 'Anonymous'}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">
                              No error logs found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="console" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Console Error Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consoleErrors?.map((error, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-red-800">{error.type}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-red-700">{error.message}</p>
                        {error.stack && (
                          <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                            {error.stack}
                          </pre>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No console errors detected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorMonitoringTab;
