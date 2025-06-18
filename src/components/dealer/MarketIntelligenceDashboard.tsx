
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Globe, Brain, BarChart3 } from 'lucide-react';
import GlobalAIIntegration from './GlobalAIIntegration';

const MarketIntelligenceDashboard = () => {
  const handleAIDataDiscovered = (data: any) => {
    console.log('AI discovered data:', data);
    // Handle the discovered data for market intelligence
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-sm text-gray-600">Market Analysis Complete</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <p className="text-sm text-gray-600">Global Data Points</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Real-time</div>
              <p className="text-sm text-gray-600">Intelligence Updates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global AI Integration */}
      <GlobalAIIntegration onDataDiscovered={handleAIDataDiscovered} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Price Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ancient Coins</span>
                  <span className="text-green-600 text-sm">+12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Modern Coins</span>
                  <span className="text-blue-600 text-sm">+8.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Coins</span>
                  <span className="text-purple-600 text-sm">+25.1%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Global Demand</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">North America</span>
                  <span className="text-sm">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Europe</span>
                  <span className="text-sm">Medium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Asia Pacific</span>
                  <span className="text-sm">Growing</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketIntelligenceDashboard;
