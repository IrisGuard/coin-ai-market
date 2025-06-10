
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Bug, Zap, Activity } from 'lucide-react';
import { useRealTimeErrors } from '@/hooks/admin/useRealTimeErrors';

const RealTimeErrorMonitor = () => {
  const { recentErrors, isConnected } = useRealTimeErrors();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Bug className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-Time Error Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentErrors.length === 0 ? (
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              No recent errors detected. System is running smoothly! 🎉
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentErrors.map((error) => (
              <div key={error.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-1 rounded-lg ${getSeverityColor(error.severity)} border`}>
                      {getSeverityIcon(error.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{error.error_type}</span>
                        <Badge className={getSeverityColor(error.severity)}>
                          {error.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{error.message}</p>
                      {error.page_url && (
                        <p className="text-xs text-gray-500 truncate font-mono">
                          {error.page_url}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(error.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeErrorMonitor;
