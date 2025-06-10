
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PerformanceStatsCards from './PerformanceStatsCards';
import PerformanceDetailsTable from './PerformanceDetailsTable';

interface PerformanceTabProps {
  stores: any[];
  performanceMetrics: any[];
}

const PerformanceTab = ({ stores, performanceMetrics }: PerformanceTabProps) => {
  return (
    <TabsContent value="performance" className="mt-6">
      <PerformanceStatsCards stores={stores} performanceMetrics={performanceMetrics} />
      <PerformanceDetailsTable performanceMetrics={performanceMetrics} />
    </TabsContent>
  );
};

export default PerformanceTab;
