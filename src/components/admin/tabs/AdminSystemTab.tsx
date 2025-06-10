
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Database, Gauge, Zap } from 'lucide-react';
import AdminSystemHealth from '../enhanced/AdminSystemHealth';
import RealTimeAdminDashboard from '../enhanced/RealTimeAdminDashboard';
import CompleteDataIntegration from '../enhanced/CompleteDataIntegration';
import ProductionMonitoring from '../enhanced/ProductionMonitoring';

const AdminSystemTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Integration
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <AdminSystemHealth />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <RealTimeAdminDashboard />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <CompleteDataIntegration />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <ProductionMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemTab;
