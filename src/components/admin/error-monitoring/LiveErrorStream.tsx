
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface LiveErrorStreamProps {
  recentErrors: any[];
}

const LiveErrorStream = ({ recentErrors }: LiveErrorStreamProps) => {
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
  );
};

export default LiveErrorStream;
