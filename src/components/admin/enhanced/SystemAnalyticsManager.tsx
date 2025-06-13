
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Activity, Users, Search, TrendingUp, Database } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SystemAnalyticsManager = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: analyticsEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['analytics-events', timeRange],
    queryFn: async () => {
      const timeFilter = timeRange === '24h' ? '1 day' : 
                        timeRange === '7d' ? '7 days' : 
                        timeRange === '30d' ? '30 days' : '1 day';

      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', new Date(Date.now() - (timeFilter === '1 day' ? 86400000 : timeFilter === '7 days' ? 604800000 : 2592000000)).toISOString())
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching analytics events:', error);
        throw error;
      }
      
      console.log('✅ Analytics events loaded:', data?.length);
      return data || [];
    }
  });

  const { data: userAnalytics, isLoading: userLoading } = useQuery({
    queryKey: ['user-analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching user analytics:', error);
        throw error;
      }
      
      console.log('✅ User analytics loaded:', data?.length);
      return data || [];
    }
  });

  const { data: searchAnalytics, isLoading: searchLoading } = useQuery({
    queryKey: ['search-analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching search analytics:', error);
        throw error;
      }
      
      console.log('✅ Search analytics loaded:', data?.length);
      return data || [];
    }
  });

  const { data: systemMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['system-metrics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching system metrics:', error);
        throw error;
      }
      
      console.log('✅ System metrics loaded:', data?.length);
      return data || [];
    }
  });

  if (eventsLoading || userLoading || searchLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const eventStats = {
    totalEvents: analyticsEvents?.length || 0,
    uniqueUsers: new Set(analyticsEvents?.filter(e => e.user_id).map(e => e.user_id)).size,
    topPages: analyticsEvents?.reduce((acc, event) => {
      acc[event.page_url] = (acc[event.page_url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    topEventTypes: analyticsEvents?.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const userStats = {
    totalSessions: userAnalytics?.length || 0,
    avgSessionTime: userAnalytics?.reduce((sum, session) => sum + (session.time_spent_minutes || 0), 0) / (userAnalytics?.length || 1),
    avgPagesPerSession: userAnalytics?.reduce((sum, session) => sum + (session.page_views || 0), 0) / (userAnalytics?.length || 1)
  };

  const searchStats = {
    totalSearches: searchAnalytics?.length || 0,
    topQueries: searchAnalytics?.reduce((acc, search) => {
      acc[search.search_query] = (acc[search.search_query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    avgResultsShown: searchAnalytics?.reduce((sum, search) => sum + (search.results_count || 0), 0) / (searchAnalytics?.length || 1)
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              System Analytics Dashboard
            </CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{eventStats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{eventStats.uniqueUsers}</div>
                <p className="text-xs text-muted-foreground">Unique Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{userStats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">User Sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{searchStats.totalSearches}</div>
                <p className="text-xs text-muted-foreground">Search Queries</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Event Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(eventStats.topEventTypes || {})
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([eventType, count]) => (
                            <div key={eventType} className="flex justify-between items-center">
                              <span className="text-sm">{eventType}</span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(eventStats.topPages || {})
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([page, count]) => (
                            <div key={page} className="flex justify-between items-center">
                              <span className="text-sm truncate">{page}</span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Page URL</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Metadata</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsEvents?.slice(0, 10).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant="outline">{event.event_type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {event.page_url}
                        </TableCell>
                        <TableCell>
                          {event.user_id ? (
                            <Badge variant="outline">{event.user_id.substring(0, 8)}...</Badge>
                          ) : (
                            <span className="text-muted-foreground">Anonymous</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(event.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{Math.round(userStats.avgSessionTime)}</div>
                      <p className="text-xs text-muted-foreground">Avg Session Time (min)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{Math.round(userStats.avgPagesPerSession)}</div>
                      <p className="text-xs text-muted-foreground">Avg Pages/Session</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{userStats.totalSessions}</div>
                      <p className="text-xs text-muted-foreground">Total Sessions</p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Pages Viewed</TableHead>
                      <TableHead>Device Info</TableHead>
                      <TableHead>Started</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAnalytics?.slice(0, 10).map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <span className="font-mono text-sm">{session.session_id.substring(0, 8)}...</span>
                        </TableCell>
                        <TableCell>
                          {session.user_id ? (
                            <Badge variant="outline">{session.user_id.substring(0, 8)}...</Badge>
                          ) : (
                            <span className="text-muted-foreground">Anonymous</span>
                          )}
                        </TableCell>
                        <TableCell>{session.time_spent_minutes || 0} min</TableCell>
                        <TableCell>{session.page_views || 0}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {(session.device_info as any)?.type || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(session.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="search">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{searchStats.totalSearches}</div>
                      <p className="text-xs text-muted-foreground">Total Searches</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{Math.round(searchStats.avgResultsShown)}</div>
                      <p className="text-xs text-muted-foreground">Avg Results Shown</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{Object.keys(searchStats.topQueries || {}).length}</div>
                      <p className="text-xs text-muted-foreground">Unique Queries</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Search Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(searchStats.topQueries || {})
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10)
                        .map(([query, count]) => (
                          <div key={query} className="flex justify-between items-center">
                            <span className="text-sm">{query}</span>
                            <Badge variant="outline">{count} searches</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Recorded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemMetrics?.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell>
                        <div className="font-medium">{metric.metric_name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{metric.metric_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{metric.metric_value}</span>
                      </TableCell>
                      <TableCell>
                        {metric.tags && Object.keys(metric.tags).length > 0 ? (
                          <Button variant="outline" size="sm">View Tags</Button>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(metric.recorded_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAnalyticsManager;
