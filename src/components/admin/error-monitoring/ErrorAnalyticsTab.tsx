
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorAnalyticsTabProps {
  errorAnalytics: any;
}

const ErrorAnalyticsTab = ({ errorAnalytics }: ErrorAnalyticsTabProps) => {
  return (
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
                  {errorAnalytics?.error_rate?.toFixed(1) || 0}%
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
              {errorAnalytics?.categories?.map((category: any, index: number) => (
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
  );
};

export default ErrorAnalyticsTab;
