
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Activity, BarChart3, Eye } from 'lucide-react';
import { useRealTimeErrors } from '@/hooks/admin/useRealTimeErrors';
import { useErrorLogs, useConsoleErrors, useErrorAnalytics } from '@/hooks/admin/useErrorLogs';
import RealTimeErrorsTab from '../error-monitoring/RealTimeErrorsTab';
import ErrorAnalyticsTab from '../error-monitoring/ErrorAnalyticsTab';
import ErrorLogsTab from '../error-monitoring/ErrorLogsTab';
import ConsoleErrorsTab from '../error-monitoring/ConsoleErrorsTab';

const AdminErrorMonitoringTab = () => {
  const { recentErrors, isConnected } = useRealTimeErrors();
  const { data: errorLogs, isLoading: logsLoading } = useErrorLogs();
  const { data: errorAnalytics, isLoading: analyticsLoading } = useErrorAnalytics();
  const { data: consoleErrors, isLoading: consoleLoading } = useConsoleErrors();

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

            <RealTimeErrorsTab recentErrors={recentErrors} />
            <ErrorAnalyticsTab errorAnalytics={errorAnalytics} />
            <ErrorLogsTab errorLogs={errorLogs || []} />
            <ConsoleErrorsTab consoleErrors={consoleErrors || []} />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorMonitoringTab;
