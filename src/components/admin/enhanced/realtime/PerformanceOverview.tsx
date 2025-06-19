
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceOverviewProps {
  isLive: boolean;
}

const PerformanceOverview = ({ isLive }: PerformanceOverviewProps) => {
  const { data: metrics } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const [systemHealth, errorCount] = await Promise.all([
        supabase.from('system_metrics').select('*').order('created_at', { ascending: false }).limit(1),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const errors24h = errorCount.count || 0;
      const performanceScore = Math.max(0, 100 - errors24h);

      return {
        active_users: 0,
        active_sessions: 0,
        pending_transactions: 0,
        system_alerts: errors24h,
        performance_score: performanceScore,
        last_updated: new Date().toISOString()
      };
    },
    refetchInterval: isLive ? 5000 : false,
    enabled: true
  });

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const performanceScore = metrics?.performance_score || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Overall Performance Score</div>
            <div className="text-xs text-muted-foreground">
              Last updated: {metrics ? new Date(metrics.last_updated).toLocaleTimeString() : 'Loading...'}
            </div>
          </div>
          <div className={`text-4xl font-bold ${getPerformanceColor(performanceScore)}`}>
            {performanceScore}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getPerformanceBarColor(performanceScore)}`}
            style={{ width: `${performanceScore}%` }}
          />
        </div>

        {isLive && (
          <div className="mt-4 text-center">
            <Badge variant="outline" className="animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Real-time monitoring active
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceOverview;
