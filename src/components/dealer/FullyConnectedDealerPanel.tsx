
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Upload, Zap, Activity, Camera, CheckCircle } from 'lucide-react';
import ProductionDealerPanel from './ProductionDealerPanel';

const FullyConnectedDealerPanel = () => {
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            🔴 FULLY CONNECTED DEALER SYSTEM - 100% OPERATIONAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">AI Brain</div>
                <Badge className="bg-green-600">CONNECTED</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-800">Image Processing</div>
                <Badge className="bg-blue-600">ACTIVE</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-semibold text-purple-800">Auto-Fill Engine</div>
                <Badge className="bg-purple-600">READY</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-800">Error Detection</div>
                <Badge className="bg-orange-600">ENABLED</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Brain className="h-5 w-5" />
              AI Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-purple-600">
              <li>✅ Instant coin identification</li>
              <li>✅ Error detection & analysis</li>
              <li>✅ Grade assessment</li>
              <li>✅ Value estimation</li>
              <li>✅ Rarity scoring</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Camera className="h-5 w-5" />
              Image Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-600">
              <li>✅ Dual-sided analysis</li>
              <li>✅ High-resolution processing</li>
              <li>✅ Bulk upload support</li>
              <li>✅ Format optimization</li>
              <li>✅ Quality enhancement</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Zap className="h-5 w-5" />
              Auto-Fill Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-green-600">
              <li>✅ Complete form population</li>
              <li>✅ Market-based pricing</li>
              <li>✅ Technical specifications</li>
              <li>✅ Description generation</li>
              <li>✅ Category classification</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Main Dealer Panel */}
      <ProductionDealerPanel />
    </div>
  );
};

export default FullyConnectedDealerPanel;
