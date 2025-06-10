
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ErrorStatsCards from './ErrorStatsCards';
import LiveErrorStream from './LiveErrorStream';

interface RealTimeErrorsTabProps {
  recentErrors: any[];
}

const RealTimeErrorsTab = ({ recentErrors }: RealTimeErrorsTabProps) => {
  return (
    <TabsContent value="realtime" className="mt-6">
      <ErrorStatsCards recentErrors={recentErrors} />
      <LiveErrorStream recentErrors={recentErrors} />
    </TabsContent>
  );
};

export default RealTimeErrorsTab;
