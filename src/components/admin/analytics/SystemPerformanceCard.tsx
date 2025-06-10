
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface AnalyticsData {
  active_users_24h: number;
  searches_24h: number;
  avg_session_time: number;
  new_listings_24h: number;
  revenue_24h: number;
  active_alerts: number;
  avg_data_quality: number;
}

interface SystemPerformanceCardProps {
  analyticsDataRaw: AnalyticsData | undefined;
}

const SystemPerformanceCard: React.FC<SystemPerformanceCardProps> = ({ analyticsDataRaw }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(analyticsDataRaw?.avg_session_time || 0)}min
            </div>
            <p className="text-sm text-muted-foreground">Avg Session Time</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              €{analyticsDataRaw?.revenue_24h?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-muted-foreground">Revenue (24h)</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {analyticsDataRaw?.active_alerts || 0}
            </div>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPerformanceCard;
