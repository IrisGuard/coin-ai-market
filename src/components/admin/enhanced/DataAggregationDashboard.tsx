
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

const DataAggregationDashboard = () => {
  // Fetch analytics events - using proper column names
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching analytics events:', error);
        return [];
      }

      return data || [];
    }
  });

  // Calculate aggregated metrics from the events
  const aggregatedData = React.useMemo(() => {
    if (!events.length) {
      return {
        totalEvents: 0,
        eventTypes: {},
        recentActivity: [],
        topEvents: []
      };
    }

    const eventTypes: Record<string, number> = {};
    
    events.forEach(event => {
      const eventType = event.event_type || 'unknown';
      eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;
    });

    const topEvents = Object.entries(eventTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    return {
      totalEvents: events.length,
      eventTypes,
      recentActivity: events.slice(0, 10),
      topEvents
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {aggregatedData.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(aggregatedData.eventTypes).length}
                </div>
                <p className="text-xs text-muted-foreground">Event Types</p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {aggregatedData.topEvents[0]?.count || 0}
                </div>
                <p className="text-xs text-muted-foreground">Top Event Count</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Event Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aggregatedData.topEvents.map((event, index) => (
              <div key={event.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{event.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.count} occurrence{event.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{event.count}</Badge>
              </div>
            ))}
            
            {aggregatedData.topEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No events data available</p>
                <p className="text-sm">Analytics events will appear here once data is collected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aggregatedData.recentActivity.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{event.event_type}</div>
                  <div className="text-sm text-muted-foreground">
                    {event.page_url} • {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>
            ))}
            
            {aggregatedData.recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">Recent analytics events will be displayed here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAggregationDashboard;
