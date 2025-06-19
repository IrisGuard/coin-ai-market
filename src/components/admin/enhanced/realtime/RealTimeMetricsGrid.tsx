
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { RealTimeMetrics } from './types';

interface RealTimeMetricsGridProps {
  metrics: RealTimeMetrics;
  isLive: boolean;
}

const RealTimeMetricsGrid: React.FC<RealTimeMetricsGridProps> = ({ metrics, isLive }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{metrics.active_users}</div>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          {isLive && (
            <Badge variant="outline" className="mt-2">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{metrics.active_sessions}</div>
              <p className="text-xs text-muted-foreground">Active Sessions</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
          {isLive && (
            <Badge variant="outline" className="mt-2">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{metrics.pending_transactions}</div>
              <p className="text-xs text-muted-foreground">Pending Transactions</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          {isLive && (
            <Badge variant="outline" className="mt-2">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{metrics.system_alerts}</div>
              <p className="text-xs text-muted-foreground">System Alerts</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          {isLive && (
            <Badge variant="outline" className="mt-2">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMetricsGrid;
