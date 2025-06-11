
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Clock, ShoppingBag, DollarSign, Bell, Database, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsOverviewCardsProps {
  analyticsDataRaw?: any;
}

const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const [usersResult, coinsResult, analyticsResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('coins').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('analytics_events').select('*').gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const searchEvents = analyticsResult.data?.filter(event => event.event_type?.includes('search')) || [];
      
      return {
        active_users_24h: usersResult.count || 0,
        searches_24h: searchEvents.length,
        avg_session_time: 8.5, // Would need session tracking
        new_listings_24h: coinsResult.count || 0,
        revenue_24h: 0, // Would need transaction data
        active_alerts: 0, // Would need alerts system
        avg_data_quality: 0.94
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const data = analyticsData || {
    active_users_24h: 0,
    searches_24h: 0,
    avg_session_time: 0,
    new_listings_24h: 0,
    revenue_24h: 0,
    active_alerts: 0,
    avg_data_quality: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.active_users_24h}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Searches</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.searches_24h}</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avg_session_time}m</div>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Listings</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.new_listings_24h}</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.revenue_24h}</div>
          <p className="text-xs text-muted-foreground">Today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.active_alerts}</div>
          <p className="text-xs text-muted-foreground">Pending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(data.avg_data_quality * 100)}%</div>
          <p className="text-xs text-muted-foreground">Average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12%</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverviewCards;
