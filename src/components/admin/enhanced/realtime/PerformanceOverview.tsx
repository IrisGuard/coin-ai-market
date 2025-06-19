
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { RealTimeMetrics } from './types';

interface PerformanceOverviewProps {
  metrics: RealTimeMetrics;
  isLive: boolean;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ metrics, isLive }) => {
  const getPerformanceStatus = (score: number) => {
    if (score >= 90) return { status: 'excellent', color: 'text-green-600', icon: CheckCircle };
    if (score >= 70) return { status: 'good', color: 'text-yellow-600', icon: TrendingUp };
    return { status: 'needs attention', color: 'text-red-600', icon: AlertTriangle };
  };

  const performance = getPerformanceStatus(metrics.performance_score);
  const StatusIcon = performance.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${performance.color}`} />
          System Performance Overview
          {isLive && (
            <Badge variant="outline" className="ml-auto">
              Live Updates
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Performance Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Performance</span>
              <span className={`text-sm font-semibold ${performance.color}`}>
                {metrics.performance_score}%
              </span>
            </div>
            <Progress value={metrics.performance_score} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{metrics.active_users}</div>
              <div className="text-xs text-blue-600">Active Users</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{metrics.active_sessions}</div>
              <div className="text-xs text-green-600">Sessions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{metrics.pending_transactions}</div>
              <div className="text-xs text-orange-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{metrics.system_alerts}</div>
              <div className="text-xs text-red-600">Alerts</div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${performance.color}`} />
              <span className={`text-sm font-medium ${performance.color}`}>
                Performance Status: {performance.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(metrics.last_updated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverview;
