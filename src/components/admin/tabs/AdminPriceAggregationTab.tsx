
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAggregatedPrices, useCoinPriceHistory, useTriggerPriceAggregation } from '@/hooks/useEnhancedDataSources';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  BarChart3,
  RefreshCw,
  Search,
  Target
} from 'lucide-react';

const AdminPriceAggregationTab = () => {
  const { data: aggregatedPrices } = useAggregatedPrices();
  const triggerAggregation = useTriggerPriceAggregation();
  const [searchCoin, setSearchCoin] = useState('');
  const { data: priceHistory } = useCoinPriceHistory(searchCoin);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'falling': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    const conf = confidence || 0;
    if (conf >= 0.8) return 'bg-green-100 text-green-800';
    if (conf >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Price Aggregation System</h2>
          <p className="text-muted-foreground">
            Monitor and analyze aggregated coin prices from multiple sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search coin identifier..."
            value={searchCoin}
            onChange={(e) => setSearchCoin(e.target.value)}
            className="w-64"
          />
          <Button
            onClick={() => triggerAggregation.mutate(searchCoin)}
            disabled={!searchCoin || triggerAggregation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${triggerAggregation.isPending ? 'animate-spin' : ''}`} />
            Aggregate
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aggregated Coins</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregatedPrices?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique coin identifiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedPrices?.length ? 
                Math.round((aggregatedPrices.reduce((sum, p) => sum + ((p as any).confidence_level || 0.5), 0) / aggregatedPrices.length) * 100) 
                : 50}%
            </div>
            <p className="text-xs text-muted-foreground">
              Data reliability score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rising Prices</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {aggregatedPrices?.filter(p => (p as any).price_trend === 'rising').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Coins trending up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falling Prices</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {aggregatedPrices?.filter(p => (p as any).price_trend === 'falling').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Coins trending down
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Aggregated Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aggregated Price Data</CardTitle>
          <CardDescription>
            Latest aggregated prices with trend analysis and confidence scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aggregatedPrices?.map((price) => {
              const priceData = price as any;
              return (
                <div key={price.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{price.coin_identifier}</span>
                      {priceData.grade && (
                        <Badge variant="outline">{priceData.grade}</Badge>
                      )}
                      <Badge className={getConfidenceColor(priceData.confidence_level)}>
                        {Math.round((priceData.confidence_level || 0.5) * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sample size: {priceData.sample_size || 0} • Sources: {priceData.price_sources?.length || 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">${price.avg_price?.toFixed(2)}</div>
                      <div className={`text-sm flex items-center gap-1 ${getTrendColor(priceData.price_trend)}`}>
                        {getTrendIcon(priceData.price_trend)}
                        {priceData.trend_percentage ? `${priceData.trend_percentage.toFixed(1)}%` : '0%'}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Updated: {new Date(price.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}

            {aggregatedPrices?.length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Aggregated Data</h3>
                <p className="text-muted-foreground mb-4">
                  Price aggregation data will appear here once scraping begins
                </p>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Aggregation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price History for Searched Coin */}
      {searchCoin && priceHistory && priceHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price History: {searchCoin}</CardTitle>
            <CardDescription>
              Recent price data from all sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priceHistory.slice(0, 10).map((history) => {
                const historyData = history as any;
                return (
                  <div key={history.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">${history.price}</div>
                        <div className="text-sm text-muted-foreground">
                          {history.source} • {historyData.sale_type || 'market'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{historyData.grade || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">
                        {historyData.sale_date ? new Date(historyData.sale_date).toLocaleDateString() : 'No date'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPriceAggregationTab;
