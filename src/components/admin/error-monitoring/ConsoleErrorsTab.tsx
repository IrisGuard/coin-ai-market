
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsoleErrorsTabProps {
  consoleErrors: any[];
}

const ConsoleErrorsTab = ({ consoleErrors }: ConsoleErrorsTabProps) => {
  return (
    <TabsContent value="console" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Console Error Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consoleErrors && consoleErrors.length > 0 ? (
              consoleErrors.map((error, index) => (
                <div key={error.id || index} className="p-3 border rounded-lg bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-800">{error.error_level}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(error.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-red-700">{error.message}</p>
                  {error.source_file && (
                    <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                      {error.source_file}:{error.line_number}
                    </pre>
                  )}
                </div>
              ))
            ) : (
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
