
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsOverviewCards from '../analytics/AnalyticsOverviewCards';
import SystemPerformanceCard from '../analytics/SystemPerformanceCard';
import PopularPagesCard from '../analytics/PopularPagesCard';
import SearchAnalyticsCard from '../analytics/SearchAnalyticsCard';
import AdvancedAdminCharts from '../enhanced/AdvancedAdminCharts';
import RealTimeAdminDashboard from '../enhanced/RealTimeAdminDashboard';
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

  // Get advanced analytics data
  const { data: analyticsDataRaw, isLoading } = useQuery({
    queryKey: ['advanced-analytics-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_advanced_analytics_dashboard');
      if (error) throw error;
      return data as unknown as AnalyticsData;
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Track user behavior, performance metrics, and system analytics
          </p>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-time
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Advanced Charts
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverviewCards analyticsDataRaw={analyticsDataRaw} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SystemPerformanceCard analyticsDataRaw={analyticsDataRaw} />
            <PopularPagesCard />
          </div>
          <SearchAnalyticsCard />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeAdminDashboard />
        </TabsContent>

        <TabsContent value="charts">
          <AdvancedAdminCharts />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {analyticsDataRaw?.active_users_24h || 0}
                </div>
                <p className="text-sm text-muted-foreground">Active users (24h)</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(analyticsDataRaw?.avg_session_time || 0)}m
                </div>
                <p className="text-sm text-muted-foreground">Average session</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Search Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {analyticsDataRaw?.searches_24h || 0}
                </div>
                <p className="text-sm text-muted-foreground">Searches (24h)</p>
              </CardContent>
            </Card>
          </div>
          
          <PopularPagesCard />
          <SearchAnalyticsCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsTab;
