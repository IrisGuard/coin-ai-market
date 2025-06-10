
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsoleErrorsTabProps {
  consoleErrors: any[];
}

const ConsoleErrorsTab = ({ consoleErrors }: ConsoleErrorsTabProps) => {
  // Mock console errors with correct structure
  const mockConsoleErrors = consoleErrors || [
    {
      error_level: 'error',
      message: 'Cannot read property of undefined',
      created_at: new Date().toISOString(),
      source_file: 'component.tsx',
      line_number: 42,
      user_id: 'test-user'
    },
    {
      error_level: 'warning', 
      message: 'Variable is not defined',
      created_at: new Date().toISOString(),
      source_file: 'utils.ts',
      line_number: 15,
      user_id: 'test-user'
    }
  ];

  return (
    <TabsContent value="console" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Console Error Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockConsoleErrors.map((error, index) => (
              <div key={index} className="p-3 border rounded-lg bg-red-50">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ConsoleErrorsTab;
