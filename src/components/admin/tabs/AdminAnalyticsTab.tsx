
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsOverviewCards from '../analytics/AnalyticsOverviewCards';
import SystemPerformanceCard from '../analytics/SystemPerformanceCard';
import PopularPagesCard from '../analytics/PopularPagesCard';
import SearchAnalyticsCard from '../analytics/SearchAnalyticsCard';
import { BarChart3, Activity, TrendingUp, Users } from 'lucide-react';

const AdminAnalyticsTab = () => {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Comprehensive platform analytics and insights</p>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverviewCards />
          <div className="grid gap-6 md:grid-cols-2">
            <SystemPerformanceCard />
            <PopularPagesCard />
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <AnalyticsOverviewCards />
          <SearchAnalyticsCard />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <SystemPerformanceCard />
          <PopularPagesCard />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <SearchAnalyticsCard />
          <div className="grid gap-6 md:grid-cols-2">
            <SystemPerformanceCard />
            <PopularPagesCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsTab;
