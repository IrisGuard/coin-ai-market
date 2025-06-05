
import React from 'react';
import AIBrainPanel from '../AIBrainPanel';
import EnhancedAIAnalytics from './EnhancedAIAnalytics';
import RealTimeMonitoring from './RealTimeMonitoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIBrainCapabilities = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="brain" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brain">AI Brain Control</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brain" className="mt-6">
          <AIBrainPanel />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <EnhancedAIAnalytics />
        </TabsContent>
        
        <TabsContent value="monitoring" className="mt-6">
          <RealTimeMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIBrainCapabilities;
