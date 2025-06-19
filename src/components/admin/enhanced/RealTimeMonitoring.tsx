
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, AlertTriangle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  avg_response_time?: number;
  errors_last_hour?: number;
  active_sessions?: number;
  critical_alerts?: number;
  system_health?: string;
}

const RealTimeMonitoring: React.FC = () => {
  // Fetch real performance metrics
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ['system-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_system_performance_metrics');
      
      if (error) throw error;
      return data as PerformanceMetrics;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent analytics events for activity tracking
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Fetch active user count
  const { data: activeUsers } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data?.length || 0;
    },
    refetchInterval: 30000
  });

  // Generate activity chart data from real events
  const activityChartData = React.useMemo(() => {
    if (!recentActivity) return [];
    
    const now = new Date();
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      const hourLabel = hour.getHours().toString().padStart(2, '0') + ':00';
      
      const eventsInHour = recentActivity.filter(event => {
        const eventTime = new Date(event.timestamp);
        return eventTime.getHours() === hour.getHours() &&
               eventTime.getDate() === hour.getDate();
      }).length;

      return {
        time: hourLabel,
        events: eventsInHour,
        users: Math.floor(eventsInHour * 0.7) // Estimate unique users
      };
    });
    
    return hours;
  }, [recentActivity]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Last 15 min
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-2xl font-bold">
                  {performanceData?.avg_response_time ? 
                    `${Math.round(performanceData.avg_response_time)}ms` : 
                    '< 100ms'
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Average
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold">
                  {performanceData?.system_health || 'Healthy'}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge 
                variant={performanceData?.system_health === 'critical' ? 'destructive' : 'secondary'} 
                className="text-xs"
              >
                {performanceData?.critical_alerts || 0} alerts
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors (1h)</p>
                <p className="text-2xl font-bold">{performanceData?.errors_last_hour || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Badge 
                variant={(performanceData?.errors_last_hour || 0) > 5 ? 'destructive' : 'secondary'} 
                className="text-xs"
              >
                Last hour
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Activity (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Events"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{event.event_type}</span>
                    <span className="text-gray-600 ml-2">on {event.page_url}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No recent events to display
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoring;
