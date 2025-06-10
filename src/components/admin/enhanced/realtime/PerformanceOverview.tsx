
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

interface RealTimeMetrics {
  active_users: number;
  active_sessions: number;
  pending_transactions: number;
  system_alerts: number;
  performance_score: number;
  last_updated: string;
}

interface PerformanceOverviewProps {
  metrics: RealTimeMetrics;
  isLive: boolean;
}

const PerformanceOverview = ({ metrics, isLive }: PerformanceOverviewProps) => {
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
              Last updated: {new Date(metrics.last_updated).toLocaleTimeString()}
            </div>
          </div>
          <div className={`text-4xl font-bold ${getPerformanceColor(metrics.performance_score)}`}>
            {metrics.performance_score}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getPerformanceBarColor(metrics.performance_score)}`}
            style={{ width: `${metrics.performance_score}%` }}
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
