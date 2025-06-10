
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AnalyticsOverviewCards from '../analytics/AnalyticsOverviewCards';
import SystemPerformanceCard from '../analytics/SystemPerformanceCard';
import PopularPagesCard from '../analytics/PopularPagesCard';
import SearchAnalyticsCard from '../analytics/SearchAnalyticsCard';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Track user behavior, performance metrics, and system analytics</p>
        </div>
      </div>

      <AnalyticsOverviewCards analyticsDataRaw={analyticsDataRaw} />
      <SystemPerformanceCard analyticsDataRaw={analyticsDataRaw} />
      <PopularPagesCard />
      <SearchAnalyticsCard />
    </div>
  );
};

export default AdminAnalyticsTab;
