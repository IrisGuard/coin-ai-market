
import React from 'react';
import { useLiveMarketplace } from './LiveMarketplaceDataProvider';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Zap, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';

const LiveProductionMarketplace: React.FC = () => {
  const { 
    coins, 
    totalCoins, 
    activeSources, 
    aiProcessingActive, 
    systemStatus,
    isLoading, 
    refreshData, 
    performEmergencyActivation 
  } = useLiveMarketplace();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">🚨 Emergency Platform Activation in Progress</h3>
          <p className="text-muted-foreground">Connecting to 16 live data sources and activating AI processing...</p>
          <div className="mt-4">
            <div className="animate-pulse text-green-600 font-medium">
              Transforming platform from 1 coin to thousands of live coins...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULLY_OPERATIONAL': return 'text-green-600 bg-green-100';
      case 'ACTIVATING': return 'text-yellow-600 bg-yellow-100';
      case 'ERROR': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Production Status */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            🔴 LIVE PRODUCTION MARKETPLACE - {systemStatus}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{totalCoins.toLocaleString()}</div>
              <div className="text-sm text-blue-500">Live Coins</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{activeSources}</div>
              <div className="text-sm text-green-500">Active Sources</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <Badge className={aiProcessingActive ? "bg-green-600" : "bg-yellow-600"}>
                {aiProcessingActive ? "AI LIVE" : "CONNECTING..."}
              </Badge>
            </div>
            
            <div className="text-center">
              <Badge className={`${getStatusColor(systemStatus)} px-3 py-1`}>
                {systemStatus}
              </Badge>
            </div>
            
            <div className="text-center">
              <Button onClick={refreshData} variant="outline" size="sm" className="mb-2">
                Refresh Data
              </Button>
              {systemStatus !== 'FULLY_OPERATIONAL' && (
                <Button onClick={performEmergencyActivation} className="bg-red-600 hover:bg-red-700" size="sm">
                  🚨 Emergency Activate
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Warning for Low Coin Count */}
      {totalCoins < 50 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">🚨 Low Coin Count Detected</h4>
                <p className="text-sm text-red-600">
                  Only {totalCoins} coins found. Platform should display thousands. 
                  <Button 
                    onClick={performEmergencyActivation} 
                    className="ml-2 bg-red-600 hover:bg-red-700" 
                    size="sm"
                  >
                    Activate Full Data Pipeline
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Coins Grid */}
      {coins.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Live Marketplace ({totalCoins.toLocaleString()} coins)
            </h2>
            <div className="flex gap-2">
              <Badge className="bg-green-600 text-white">
                🔴 LIVE DATA
              </Badge>
              <Badge className="bg-blue-600 text-white">
                AI PROCESSED
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {coins.map((coin, index) => (
              <OptimizedCoinCard 
                key={coin.id} 
                coin={coin} 
                index={index} 
                priority={index < 20}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">🚨 CRITICAL: No Live Data Detected</h2>
            <p className="text-muted-foreground mb-6">
              Platform should be displaying thousands of coins from 16 external sources.
              <br />Current count: {totalCoins} (Expected: 2000+)
            </p>
            <Button onClick={performEmergencyActivation} className="bg-red-600 hover:bg-red-700">
              🚨 EMERGENCY FULL ACTIVATION
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveProductionMarketplace;
