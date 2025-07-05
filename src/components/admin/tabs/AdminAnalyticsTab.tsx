
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsOverviewCards from '../analytics/AnalyticsOverviewCards';
import SystemPerformanceCard from '../analytics/SystemPerformanceCard';
import PopularPagesCard from '../analytics/PopularPagesCard';
import SearchAnalyticsCard from '../analytics/SearchAnalyticsCard';
import Phase8AnalyticsManager from '../enhanced/Phase8AnalyticsManager';
import Phase9MobileManager from '../enhanced/Phase9MobileManager';
import Phase6AdvancedAnalytics from '../enhanced/Phase6AdvancedAnalytics';
import Phase6PerformanceEngine from '../enhanced/Phase6PerformanceEngine';
import Phase6SecurityMonitor from '../enhanced/Phase6SecurityMonitor';
import { BarChart3, Activity, TrendingUp, Users, Smartphone, Zap, Shield } from 'lucide-react';

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
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="phase6-analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Phase 6A
          </TabsTrigger>
          <TabsTrigger value="phase6-performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Phase 6P
          </TabsTrigger>
          <TabsTrigger value="phase6-security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Phase 6S
          </TabsTrigger>
          <TabsTrigger value="phase9" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Phase 9
          </TabsTrigger>
          <TabsTrigger value="phase8" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Phase 8
          </TabsTrigger>
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

        <TabsContent value="phase6-analytics" className="space-y-6">
          <Phase6AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="phase6-performance" className="space-y-6">
          <Phase6PerformanceEngine />
        </TabsContent>

        <TabsContent value="phase6-security" className="space-y-6">
          <Phase6SecurityMonitor />
        </TabsContent>

        <TabsContent value="phase9" className="space-y-6">
          <Phase9MobileManager />
        </TabsContent>

        <TabsContent value="phase8" className="space-y-6">
          <Phase8AnalyticsManager />
        </TabsContent>

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
