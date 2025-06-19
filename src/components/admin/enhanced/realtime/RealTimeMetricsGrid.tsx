
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeMetricsGridProps {
  isLive: boolean;
}

const RealTimeMetricsGrid = ({ isLive }: RealTimeMetricsGridProps) => {
  const { data: metrics } = useQuery({
    queryKey: ['real-time-metrics'],
    queryFn: async () => {
      const [usersCount, sessionsCount, transactionsCount, alertsCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()),
        supabase.from('payment_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('error_logs').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        active_users: usersCount.count || 0,
        active_sessions: sessionsCount.count || 0,
        pending_transactions: transactionsCount.count || 0,
        system_alerts: alertsCount.count || 0,
        performance_score: 95,
        last_updated: new Date().toISOString()
      };
    },
    refetchInterval: isLive ? 10000 : false,
    enabled: true
  });

  const metricCards = [
    {
      title: 'Active Users',
      value: metrics?.active_users || 0,
      icon: Users,
      color: 'blue',
      description: 'Currently online',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Active Sessions',
      value: metrics?.active_sessions || 0,
      icon: Activity,
      color: 'green',
      description: 'Current sessions',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Pending Transactions',
      value: metrics?.pending_transactions || 0,
      icon: TrendingUp,
      color: 'purple',
      description: 'Awaiting processing',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'System Alerts',
      value: metrics?.system_alerts || 0,
      icon: AlertTriangle,
      color: 'red',
      description: 'Active alerts',
      gradient: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold text-${metric.color}-600`}>{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            {isLive && (
              <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${metric.gradient} animate-pulse`} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RealTimeMetricsGrid;
