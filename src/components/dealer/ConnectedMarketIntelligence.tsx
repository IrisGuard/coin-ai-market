
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Globe, BarChart3, RefreshCw, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ConnectedMarketIntelligence = () => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Real connection to market analytics from Admin system
  const { data: marketAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dealer-market-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('❌ Error fetching market analytics for dealer:', error);
        throw error;
      }
      
      console.log('✅ Dealer market analytics loaded:', data?.length);
      return data || [];
    }
  });

  // Real connection to external price sources
  const { data: priceSources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['dealer-price-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .eq('is_active', true)
        .order('priority_score', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching price sources for dealer:', error);
        throw error;
      }
      
      console.log('✅ Dealer price sources loaded:', data?.length);
      return data || [];
    }
  });

  // Real connection to aggregated coin prices
  const { data: aggregatedPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['dealer-aggregated-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_coin_prices')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(15);
      
      if (error) {
        console.error('❌ Error fetching aggregated prices for dealer:', error);
        throw error;
      }
      
      console.log('✅ Dealer aggregated prices loaded:', data?.length);
      return data || [];
    }
  });

  // Real connection to market analysis results
  const { data: analysisResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['dealer-market-analysis-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('❌ Error fetching market analysis results for dealer:', error);
        throw error;
      }
      
      console.log('✅ Dealer market analysis results loaded:', data?.length);
      return data || [];
    }
  });

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const refreshMarketData = async () => {
    console.log('🔄 Refreshing market data...');
    // Trigger market data refresh
  };

  if (analyticsLoading || sourcesLoading || pricesLoading || resultsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Intelligence Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Market Intelligence Dashboard
              <Badge className="bg-green-100 text-green-800">Real-Time Admin Data</Badge>
            </CardTitle>
            <Button variant="outline" onClick={refreshMarketData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{marketAnalytics?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Market Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{priceSources?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Active Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aggregatedPrices?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Price Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysisResults?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Analysis Results</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Sources & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              External Price Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priceSources?.map((source) => (
                <div 
                  key={source.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSource === source.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSource(source.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{source.source_name}</div>
                    <Badge variant="outline">
                      Priority: {source.priority_score}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Type: {source.source_type} • Reliability: {Math.round((source.reliability_score || 0) * 100)}%
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={source.specializes_in_errors ? 'default' : 'secondary'}>
                      {source.specializes_in_errors ? 'Error Specialist' : 'General'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updates every {source.update_frequency_hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Market Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketAnalytics?.map((metric) => (
                <div key={metric.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{metric.metric_name}</div>
                    <Badge variant="outline">{metric.time_period}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{metric.metric_type}</div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-bold">
                        {typeof metric.metric_value === 'number' ? 
                          metric.metric_value.toFixed(2) : metric.metric_value}
                      </span>
                    </div>
                  </div>
                  {metric.trend_analysis && (
                    <div className="mt-2 text-sm">
                      Trend: <span className={getTrendColor(metric.trend_analysis.direction || 'stable')}>
                        {metric.trend_analysis.direction || 'stable'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aggregated Prices & Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Aggregated Coin Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aggregatedPrices?.map((price) => (
                <div key={price.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{price.coin_identifier}</div>
                    <Badge className={getTrendColor(price.price_trend || 'stable').replace('text-', 'bg-').replace('-600', '-100 text-' + price.price_trend?.replace('stable', 'blue') + '-800')}>
                      {price.price_trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min:</span> ${price.min_price}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg:</span> ${price.avg_price}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max:</span> ${price.max_price}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{price.source_count} sources</span>
                    <span>Updated: {new Date(price.last_updated).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              Market Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResults?.map((result) => (
                <div key={result.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Analysis #{result.id.substring(0, 8)}
                    </div>
                    <Badge variant="outline">
                      {result.investment_recommendation || 'No recommendation'}
                    </Badge>
                  </div>
                  {result.current_market_value && (
                    <div className="text-sm">
                      Current Value: ${(result.current_market_value as any).value || 'N/A'}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Outlook: {result.market_outlook || 'Not specified'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(result.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectedMarketIntelligence;
