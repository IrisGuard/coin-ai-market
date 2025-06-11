
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsOverviewCards from '../analytics/AnalyticsOverviewCards';
import SystemPerformanceCard from '../analytics/SystemPerformanceCard';
import PopularPagesCard from '../analytics/PopularPagesCard';
import SearchAnalyticsCard from '../analytics/SearchAnalyticsCard';
import { BarChart3, Activity, TrendingUp, Users } from 'lucide-react';

interface AnalyticsData {
  active_users_24h: number;
  searches_24h: number;
  avg_session_time: number;
  new_listings_24h: number;
  revenue_24h: number;
  active_alerts: number;
  avg_data_quality: number;
}

const AdminAnalyticsTab = () => {
  const [activeView, setActiveView] = useState('overview');

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    active_users_24h: 1247,
    searches_24h: 3421,
    avg_session_time: 8.5,
    new_listings_24h: 156,
    revenue_24h: 45789.32,
    active_alerts: 89,
    avg_data_quality: 0.94
  };

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
          <AnalyticsOverviewCards analyticsDataRaw={mockAnalyticsData} />
          <div className="grid gap-6 md:grid-cols-2">
            <SystemPerformanceCard analyticsDataRaw={mockAnalyticsData} />
            <PopularPagesCard />
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <AnalyticsOverviewCards analyticsDataRaw={mockAnalyticsData} />
          <SearchAnalyticsCard />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <SystemPerformanceCard analyticsDataRaw={mockAnalyticsData} />
          <PopularPagesCard />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <SearchAnalyticsCard />
          <div className="grid gap-6 md:grid-cols-2">
            <SystemPerformanceCard analyticsDataRaw={mockAnalyticsData} />
            <PopularPagesCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsTab;
