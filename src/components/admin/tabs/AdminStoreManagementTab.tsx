
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, BarChart3, Activity } from 'lucide-react';
import { useEnhancedStoreData, useStorePerformanceMetrics, useStoreActivityLogs } from '@/hooks/admin/useEnhancedStores';
import StoreOverviewTab from '../store/StoreOverviewTab';
import PerformanceTab from '../store/PerformanceTab';
import ActivityTab from '../store/ActivityTab';

const AdminStoreManagementTab = () => {
  const { data: stores, isLoading } = useEnhancedStoreData();
  const { data: performanceMetrics } = useStorePerformanceMetrics();
  const { data: activityLogs } = useStoreActivityLogs();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading store management...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Enhanced Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stores" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stores" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Store Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance Metrics
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Logs
              </TabsTrigger>
            </TabsList>

            <StoreOverviewTab stores={stores || []} />
            <PerformanceTab stores={stores || []} performanceMetrics={performanceMetrics || []} />
            <ActivityTab activityLogs={activityLogs || []} />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoreManagementTab;
