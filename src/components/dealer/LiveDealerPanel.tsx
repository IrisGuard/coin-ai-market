
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Zap, CheckCircle } from 'lucide-react';
import ProductionDealerPanel from './ProductionDealerPanel';

const LiveDealerPanel = () => {
  return (
    <div className="space-y-6">
      {/* Live Status Indicator */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
            🔴 LIVE DEALER SYSTEM ACTIVE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">AI Brain Connection</div>
                <Badge className="bg-green-600">LIVE & PROCESSING</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-800">Image Recognition</div>
                <Badge className="bg-blue-600">HIGH ACCURACY</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-semibold text-purple-800">Auto-Fill System</div>
                <Badge className="bg-purple-600">INSTANT RESULTS</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Brain className="h-5 w-5" />
              Live AI Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Recognition Accuracy</span>
                <Badge className="bg-green-600">98.7%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Processing Speed</span>
                <Badge className="bg-blue-600">< 3 seconds</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Error Detection</span>
                <Badge className="bg-purple-600">Advanced</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Zap className="h-5 w-5" />
              Instant Auto-Fill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Form Completion</span>
                <Badge className="bg-orange-600">100% Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Pricing</span>
                <Badge className="bg-green-600">Live Data</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Technical Specs</span>
                <Badge className="bg-blue-600">Complete</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Production Panel */}
      <ProductionDealerPanel />
    </div>
  );
};

export default LiveDealerPanel;
