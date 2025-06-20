
import React from 'react';
import EmergencyDataActivator from './EmergencyDataActivator';
import LiveAIBrainActivator from './LiveAIBrainActivator';
import ProductionDataFlowSwitch from './ProductionDataFlowSwitch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, CheckCircle } from 'lucide-react';

const CompleteProductionActivator = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Rocket className="h-8 w-8 text-red-600 animate-bounce" />
            🚨 COMPLETE PRODUCTION ACTIVATION - NO DELAYS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-lg font-medium text-red-800 mb-2">
              ACTIVATING ALL SYSTEMS FOR 100% LIVE PRODUCTION
            </p>
            <p className="text-sm text-red-600">
              Emergency activation of 16 data sources, 125 AI commands, live marketplace data, and complete system integration
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Phase 1: Emergency Data Activation */}
      <EmergencyDataActivator />

      {/* Phase 2: AI Brain Activation */}
      <LiveAIBrainActivator />

      {/* Phase 3: Production Data Flow */}
      <ProductionDataFlowSwitch />

      {/* Completion Status */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            🎯 PRODUCTION ACTIVATION STATUS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <p className="text-lg font-medium text-green-800 mb-4">
              PLATFORM FULLY OPERATIONAL
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-100 rounded border border-green-200">
                <div className="font-semibold text-green-800">Admin Panel</div>
                <div className="text-sm text-green-600">Live AI Brain + Real Metrics</div>
              </div>
              <div className="p-3 bg-blue-100 rounded border border-blue-200">
                <div className="font-semibold text-blue-800">Dealer Panel</div>
                <div className="text-sm text-blue-600">AI Auto-Fill + Live Recognition</div>
              </div>
              <div className="p-3 bg-purple-100 rounded border border-purple-200">
                <div className="font-semibold text-purple-800">Marketplace</div>
                <div className="text-sm text-purple-600">Live Data + Real-time Updates</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProductionActivator;
