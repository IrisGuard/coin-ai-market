
import React from 'react';
import { useLiveMarketplace } from './LiveMarketplaceDataProvider';
import OptimizedCoinCard from '@/components/OptimizedCoinCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Zap, TrendingUp, Loader2 } from 'lucide-react';

const LiveProductionMarketplace: React.FC = () => {
  const { coins, totalCoins, activeSources, aiProcessingActive, isLoading, refreshData } = useLiveMarketplace();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Loading Live Marketplace Data</h3>
          <p className="text-muted-foreground">Connecting to live data sources and AI processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Production Status */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            🔴 LIVE PRODUCTION MARKETPLACE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{totalCoins}</div>
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
              <Button onClick={refreshData} variant="outline" size="sm">
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Coins Grid */}
      {coins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {coins.map((coin, index) => (
            <OptimizedCoinCard 
              key={coin.id} 
              coin={coin} 
              index={index} 
              priority={index < 10}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Marketplace Initializing</h2>
            <p className="text-muted-foreground mb-6">
              Live data sources are being activated. Coins will appear as the system processes external marketplace feeds.
            </p>
            <Button onClick={refreshData} className="bg-primary hover:bg-primary/90">
              Check for New Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveProductionMarketplace;
