
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorLogsTabProps {
  errorLogs: any[];
}

const ErrorLogsTab = ({ errorLogs }: ErrorLogsTabProps) => {
  return (
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
  );
};

export default ErrorLogsTab;
