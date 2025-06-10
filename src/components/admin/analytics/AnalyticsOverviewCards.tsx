
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Activity, Eye, Search } from 'lucide-react';

interface AnalyticsData {
  active_users_24h: number;
  searches_24h: number;
  avg_session_time: number;
  new_listings_24h: number;
  revenue_24h: number;
  active_alerts: number;
  avg_data_quality: number;
}

interface AnalyticsOverviewCardsProps {
  analyticsDataRaw: AnalyticsData | undefined;
}

const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({ analyticsDataRaw }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsDataRaw?.active_users_24h || 0}</div>
          <p className="text-xs text-muted-foreground">daily active users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Searches (24h)</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsDataRaw?.searches_24h || 0}</div>
          <p className="text-xs text-muted-foreground">search queries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Listings (24h)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsDataRaw?.new_listings_24h || 0}</div>
          <p className="text-xs text-muted-foreground">new coin listings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((analyticsDataRaw?.avg_data_quality || 0) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">average quality score</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverviewCards;
