
import React from 'react';
import AIBrainPanel from '../AIBrainPanel';
import EnhancedAIAnalytics from './EnhancedAIAnalytics';
import RealTimeMonitoring from './RealTimeMonitoring';
import AdvancedAIControls from './AdvancedAIControls';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIBrainCapabilities = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="brain" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="brain">AI Brain Control</TabsTrigger>
          <TabsTrigger value="advanced">Advanced AI</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitor</TabsTrigger>
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brain" className="mt-6">
          <AIBrainPanel />
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <AdvancedAIControls />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <EnhancedAIAnalytics />
        </TabsContent>
        
        <TabsContent value="monitoring" className="mt-6">
          <RealTimeMonitoring />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <AdvancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIBrainCapabilities;
