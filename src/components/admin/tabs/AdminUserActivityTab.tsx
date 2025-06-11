
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Clock,
  Eye,
  MousePointer,
  TrendingUp,
  Activity,
  Calendar,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminUserActivityTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('24h');

  // Fetch user activity data
  const { data: activityData = [], isLoading } = useQuery({
    queryKey: ['admin-user-activity', timeFilter],
    queryFn: async () => {
      const timeMap = {
        '1h': 1,
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30
      };
      
      const hoursBack = timeMap[timeFilter as keyof typeof timeMap] || 24;
      
      const { data, error } = await supabase
        .from('analytics_events')
        .select(`
          *,
          profiles!analytics_events_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .gte('timestamp', new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get statistics
  const stats = {
    totalEvents: activityData.length,
    uniqueUsers: [...new Set(activityData.map(a => a.user_id).filter(Boolean))].length,
    pageViews: activityData.filter(a => a.event_type === 'page_view').length,
    searches: activityData.filter(a => a.event_type.includes('search')).length
  };

  // Group by event types
  const eventTypes = activityData.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredData = activityData.filter(event => {
    const matchesSearch = !searchTerm || 
      event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.page_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.profiles as any)?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Activity Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor user behavior, interactions, and system usage patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Last {timeFilter}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pageViews}</div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Searches</CardTitle>
            <Search className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.searches}</div>
            <p className="text-xs text-muted-foreground">Search queries</p>
          </CardContent>
        </Card>
      </div>

      {/* Event Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(eventTypes)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([type, count]) => (
                <div key={type} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm truncate">{type}</div>
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by event type, URL, or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Activity Stream */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredData.slice(0, 100).map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {event.event_type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">
                      {(event.profiles as any)?.email || 'Anonymous'}
                    </span>
                    {event.page_url && (
                      <span className="text-gray-500 ml-2">
                        → {event.page_url}
                      </span>
                    )}
                  </div>
                  
                  {event.metadata && Object.keys(event.metadata as any).length > 0 && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {JSON.stringify(event.metadata).substring(0, 100)}...
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activity found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserActivityTab;
