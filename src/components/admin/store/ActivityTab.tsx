
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface ActivityTabProps {
  activityLogs: any[];
}

const ActivityTab = ({ activityLogs }: ActivityTabProps) => {
  return (
    <TabsContent value="activity" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Store Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLogs?.map((log) => (
              <div key={log.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{log.activity_type}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Store: {log.stores?.name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ActivityTab;
