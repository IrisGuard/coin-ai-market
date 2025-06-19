
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ErrorMarketDataManager = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const queryClient = useQueryClient();

  // Fetch error coins market data
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['error-coins-market-data', selectedGrade],
    queryFn: async () => {
      let query = supabase
        .from('error_coins_market_data')
        .select(`
          *,
          error_coins_knowledge (
            error_name,
            error_type,
            error_category
          )
        `)
        .order('updated_at', { ascending: false });

      if (selectedGrade !== 'all') {
        query = query.eq('grade', selectedGrade);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch price history for trending analysis
  const { data: priceHistory } = useQuery({
    queryKey: ['coin-price-history-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coin_price_history')
        .select('*')
        .gte('date_recorded', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('date_recorded', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch external price sources
  const { data: priceSources } = useQuery({
    queryKey: ['external-price-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .eq('is_active', true)
        .eq('specializes_in_errors', true)
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Update market data
  const updateMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real implementation, this would trigger price updates
      const { error } = await supabase
        .from('error_coins_market_data')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error-coins-market-data'] });
      toast({
        title: "Success",
        description: "Market data updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get unique grades for filter
  const availableGrades = React.useMemo(() => {
    const grades = new Set(marketData?.map(item => item.grade) || []);
    return Array.from(grades).sort();
  }, [marketData]);

  // Calculate market statistics
  const marketStats = React.useMemo(() => {
    if (!marketData || marketData.length === 0) {
      return {
        totalEntries: 0,
        avgPremium: 0,
        highestValue: 0,
        trendingUp: 0
      };
    }

    const totalEntries = marketData.length;
    const avgPremium = marketData.reduce((sum, item) => sum + (item.premium_percentage || 0), 0) / totalEntries;
    const highestValue = Math.max(...marketData.map(item => item.market_value_high || 0));
    const trendingUp = marketData.filter(item => item.market_trend === 'up').length;

    return {
      totalEntries,
      avgPremium: Math.round(avgPremium),
      highestValue,
      trendingUp
    };
  }, [marketData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Entries</p>
                <p className="text-xl font-bold">{marketStats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Avg Premium</p>
                <p className="text-xl font-bold">{marketStats.avgPremium}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-600">Highest Value</p>
                <p className="text-xl font-bold">${marketStats.highestValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Trending Up</p>
                <p className="text-xl font-bold">{marketStats.trendingUp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Grades</option>
              {availableGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Prices
          </Button>
        </div>
      </div>

      {/* Market Data Tabs */}
      <Tabs defaultValue="market-data">
        <TabsList>
          <TabsTrigger value="market-data">Market Data</TabsTrigger>
          <TabsTrigger value="price-sources">Price Sources</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="market-data" className="space-y-4">
          {marketData?.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {entry.error_coins_knowledge?.error_name || 'Unknown Error'}
                    </CardTitle>
                    <Badge variant="outline">{entry.grade}</Badge>
                    <Badge 
                      variant="outline" 
                      className={getTrendColor(entry.market_trend || 'stable')}
                    >
                      {getTrendIcon(entry.market_trend || 'stable')}
                      {entry.market_trend || 'stable'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateMutation.mutate(entry.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Low Value:</span>
                    <div className="text-green-600">
                      ${entry.market_value_low?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">High Value:</span>
                    <div className="text-blue-600">
                      ${entry.market_value_high?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Avg Value:</span>
                    <div className="text-purple-600">
                      ${entry.market_value_avg?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Premium:</span>
                    <div className="text-orange-600">{entry.premium_percentage}%</div>
                  </div>
                </div>
                
                {entry.last_sale_price && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Sale: ${entry.last_sale_price.toLocaleString()}</span>
                      <span className="text-gray-500">
                        Confidence: {Math.round((entry.data_confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="price-sources" className="space-y-4">
          {priceSources?.map((source) => (
            <Card key={source.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{source.source_name}</CardTitle>
                  <Badge variant="outline">{source.source_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Reliability:</span>
                    <div className="text-green-600">
                      {Math.round((source.reliability_score || 0) * 100)}%
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Rate Limit:</span>
                    <div className="text-blue-600">{source.rate_limit_per_hour}/hour</div>
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>
                    <div className="text-purple-600">{source.priority_score}/100</div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Focus:</span>
                    <div className="flex flex-wrap gap-1">
                      {source.market_focus?.map((focus, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Trending Up</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {marketData?.filter(item => item.market_trend === 'up').length} error coins showing price increases
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Stable Market</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {marketData?.filter(item => item.market_trend === 'stable' || !item.market_trend).length} error coins with stable pricing
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Price Decline</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    {marketData?.filter(item => item.market_trend === 'down').length} error coins showing price decreases
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorMarketDataManager;
