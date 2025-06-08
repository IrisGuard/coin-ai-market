
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, CheckCircle } from 'lucide-react';

interface SystemHealthTabProps {
  avgResponseTime: number;
  dataSourcesActive: number;
  totalDataSources: number;
}

const SystemHealthTab = ({ avgResponseTime, dataSourcesActive, totalDataSources }: SystemHealthTabProps) => {
  return (
    <div className="space-y-6">
      {/* System Health Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Function Security</span>
                <Badge className="bg-electric-green/10 text-electric-green">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Secure
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">OTP Configuration</span>
                <Badge className="bg-electric-green/10 text-electric-green">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Updated (10 min)
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">RLS Policies</span>
                <Badge className="bg-electric-green/10 text-electric-green">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium">{avgResponseTime.toFixed(0)}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - (avgResponseTime / 10))} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Data Source Uptime</span>
                  <span className="text-sm font-medium">
                    {((dataSourcesActive / (totalDataSources || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(dataSourcesActive / (totalDataSources || 1)) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">System Load</span>
                  <span className="text-sm font-medium">Normal</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealthTab;
