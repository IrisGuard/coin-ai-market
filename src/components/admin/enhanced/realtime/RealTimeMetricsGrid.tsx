
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface RealTimeMetrics {
  active_users: number;
  active_sessions: number;
  pending_transactions: number;
  system_alerts: number;
  performance_score: number;
  last_updated: string;
}

interface RealTimeMetricsGridProps {
  metrics: RealTimeMetrics;
  isLive: boolean;
}

const RealTimeMetricsGrid = ({ metrics, isLive }: RealTimeMetricsGridProps) => {
  const metricCards = [
    {
      title: 'Active Users',
      value: metrics.active_users,
      icon: Users,
      color: 'blue',
      description: 'Currently online',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Active Sessions',
      value: metrics.active_sessions,
      icon: Activity,
      color: 'green',
      description: 'Current sessions',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Pending Transactions',
      value: metrics.pending_transactions,
      icon: TrendingUp,
      color: 'purple',
      description: 'Awaiting processing',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'System Alerts',
      value: metrics.system_alerts,
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
