
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, BarChart3, AlertTriangle } from 'lucide-react';

interface PanelOverviewProps {
  dataSourcesActive: number;
  totalDataSources: number;
  avgResponseTime: number;
  providers: any[];
  systemMetrics: any;
  userBehavior: any;
  performance: any;
  errorCoinsData: any[];
}

const PanelOverview = ({
  dataSourcesActive,
  totalDataSources,
  avgResponseTime,
  providers,
  systemMetrics,
  userBehavior,
  performance,
  errorCoinsData
}: PanelOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Real-time Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Sources Active</span>
                <Badge variant="secondary">{dataSourcesActive}/{totalDataSources}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Response Time</span>
                <span className="text-sm font-medium">{avgResponseTime.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Brain Status</span>
                <Badge className="bg-electric-green/10 text-electric-green">
                  {providers?.length > 0 ? 'Active' : 'Initializing'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Connections</span>
                <span className="text-sm font-medium">{systemMetrics?.activeConnections || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Users</span>
                <span className="text-sm font-medium">{userBehavior?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">{performance?.successRate || 92}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Coins Knowledge Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Error Coins Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-purple">
                {errorCoinsData?.length || 0}
              </div>
              <p className="text-sm text-gray-600">Known Error Types</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-orange">
                {errorCoinsData?.reduce((acc, item) => acc + (item.identification_techniques?.length || 0), 0) || 0}
              </div>
              <p className="text-sm text-gray-600">Market Data Points</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-green">
                {performance?.successRate || 85}%
              </div>
              <p className="text-sm text-gray-600">ID Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PanelOverview;
