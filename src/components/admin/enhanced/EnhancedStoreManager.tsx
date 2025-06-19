
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Store, Activity, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const EnhancedStoreManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch store activity logs
  const { data: activityLogs = [], isLoading: activityLoading } = useQuery({
    queryKey: ['store-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_activity_logs')
        .select(`
          *,
          profiles:performed_by (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
      }

      return data || [];
    }
  });

  // Calculate aggregated stats
  const aggregatedData = React.useMemo(() => {
    const totalLogs = activityLogs.length;
    const criticalCount = activityLogs.filter(log => log.severity_level === 'critical').length;
    const errorCount = activityLogs.filter(log => log.severity_level === 'error').length;
    const uniqueStores = new Set(activityLogs.map(log => log.store_id)).size;

    return {
      totalLogs,
      criticalCount,
      errorCount,
      uniqueStores,
      recentLogs: activityLogs.slice(0, 10)
    };
  }, [activityLogs]);

  if (activityLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {aggregatedData.totalLogs}
                </div>
                <p className="text-xs text-muted-foreground">Total Activity Logs</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {aggregatedData.criticalCount}
                </div>
                <p className="text-xs text-muted-foreground">Critical Issues</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {aggregatedData.errorCount}
                </div>
                <p className="text-xs text-muted-foreground">Error Count</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {aggregatedData.uniqueStores}
                </div>
                <p className="text-xs text-muted-foreground">Active Stores</p>
              </div>
              <Store className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Store Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aggregatedData.recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{log.activity_type}</div>
                  <div className="text-sm text-muted-foreground">
                    {log.activity_description} • {new Date(log.created_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Store ID: {log.store_id} • Severity: {log.severity_level}
                  </div>
                </div>
                <Badge variant={log.severity_level === 'critical' ? 'destructive' : 'outline'}>
                  {log.severity_level}
                </Badge>
              </div>
            ))}
            
            {aggregatedData.recentLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No recent activity</p>
                <p className="text-sm">Store activity will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStoreManager;
