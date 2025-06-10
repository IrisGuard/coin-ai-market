
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';

const AdminPriceAggregationTab = () => {
  const aggregationStats = {
    totalSources: 12,
    activeSources: 9,
    lastUpdate: '2 minutes ago',
    averageAccuracy: 94.2,
    pricePoints: 15847,
    conflictingPrices: 23
  };

  const priceSources = [
    { name: 'eBay Sold Listings', status: 'active', accuracy: 96, lastSync: '1 min ago' },
    { name: 'Heritage Auctions', status: 'active', accuracy: 98, lastSync: '3 min ago' },
    { name: 'PCGS Price Guide', status: 'active', accuracy: 92, lastSync: '5 min ago' },
    { name: 'NGC Price Guide', status: 'warning', accuracy: 89, lastSync: '15 min ago' },
    { name: 'Coin Values', status: 'error', accuracy: 85, lastSync: '2 hours ago' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregationStats.activeSources}/{aggregationStats.totalSources}</div>
            <p className="text-xs text-muted-foreground">Price data sources</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregationStats.averageAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Average accuracy</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Points</CardTitle>
            <RefreshCw className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregationStats.pricePoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Updated {aggregationStats.lastUpdate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Price Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price Data Sources
            </CardTitle>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priceSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    source.status === 'active' ? 'bg-green-500' :
                    source.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Accuracy: {source.accuracy}% • Last sync: {source.lastSync}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(source.status)}
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conflicting Prices Alert */}
      {aggregationStats.conflictingPrices > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Price Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              {aggregationStats.conflictingPrices} price conflicts detected across sources. 
              Review and resolve conflicts to improve accuracy.
            </p>
            <Button className="mt-3" variant="outline">
              Review Conflicts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPriceAggregationTab;
