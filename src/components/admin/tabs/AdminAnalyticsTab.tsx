
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, Users, Activity, Eye, Search } from 'lucide-react';

interface AnalyticsData {
  active_users_24h: number;
  searches_24h: number;
  avg_session_time: number;
  new_listings_24h: number;
  avg_data_quality: number;
}

interface PerformanceData {
  avg_response_time: number;
  active_sessions: number;
  errors_last_hour: number;
}

const AdminAnalyticsTab = () => {
  // Get analytics data
  const { data: analyticsDataRaw, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_advanced_analytics_dashboard');
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  // Get performance metrics
  const { data: performanceDataRaw, isLoading: perfLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_system_performance_metrics');
      if (error) throw error;
      return data;
    },
  });

  // Safely cast the data
  const analyticsData = analyticsDataRaw as AnalyticsData | null;
  const performanceData = performanceDataRaw as PerformanceData | null;

  // Get page views
  const { data: pageViews, isLoading: viewsLoading } = useQuery({
    queryKey: ['page-views'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get search analytics
  const { data: searchAnalytics, isLoading: searchLoading } = useQuery({
    queryKey: ['search-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">Track user behavior, performance metrics, and system analytics</p>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.active_users_24h || 0}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(analyticsData?.avg_session_time || 0)} min avg session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Searches (24h)</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.searches_24h || 0}</div>
            <p className="text-xs text-muted-foreground">search queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Listings (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.new_listings_24h || 0}</div>
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
              {Math.round((analyticsData?.avg_data_quality || 0) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">average quality score</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(performanceData?.avg_response_time || 0)}ms
              </div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {performanceData?.active_sessions || 0}
              </div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {performanceData?.errors_last_hour || 0}
              </div>
              <p className="text-sm text-muted-foreground">Errors (Last Hour)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Popular Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viewsLoading ? (
              <div className="text-center py-8">Loading page views...</div>
            ) : pageViews?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No page view data found
              </div>
            ) : (
              pageViews?.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{page.page_path}</div>
                    <div className="text-sm text-muted-foreground">
                      Last viewed: {new Date(page.last_viewed).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{page.view_count}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recent Search Queries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {searchLoading ? (
              <div className="text-center py-8">Loading search analytics...</div>
            ) : searchAnalytics?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No search data found
              </div>
            ) : (
              searchAnalytics?.map((search) => (
                <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">"{search.search_query}"</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(search.created_at).toLocaleString()}
                      {search.search_duration_ms && ` • ${search.search_duration_ms}ms`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {search.results_count || 0} results
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsTab;
