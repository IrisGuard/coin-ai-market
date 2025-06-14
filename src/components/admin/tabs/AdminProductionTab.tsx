
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionPlatformActivator from '@/components/admin/ProductionPlatformActivator';
import LivePlatformMonitor from '@/components/admin/LivePlatformMonitor';
import { Rocket, Activity, Settings } from 'lucide-react';

const AdminProductionTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Rocket className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Production Platform Management</h2>
      </div>

      <Tabs defaultValue="activation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Platform Activation
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activation">
          <ProductionPlatformActivator />
        </TabsContent>

        <TabsContent value="monitoring">
          <LivePlatformMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProductionTab;
