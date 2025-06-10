
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ConsoleErrorsTabProps {
  consoleErrors: any[];
}

const ConsoleErrorsTab = ({ consoleErrors }: ConsoleErrorsTabProps) => {
  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TabsContent value="console" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Console Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {consoleErrors.map((error) => (
              <div key={error.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-medium truncate max-w-md">{error.message}</span>
                    <Badge className={getSeverityColor(error.error_level)}>
                      {error.error_level}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(error.created_at).toLocaleTimeString()}
                  </span>
                </div>
                {error.source_file && (
                  <p className="text-xs text-gray-500">
                    {error.source_file}:{error.line_number}:{error.column_number}
                  </p>
                )}
              </div>
            ))}
            {consoleErrors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No console errors detected
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ConsoleErrorsTab;
