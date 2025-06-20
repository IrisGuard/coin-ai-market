
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ErrorMarketDataManager = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const { data: marketData = [], isLoading, refetch } = useQuery({
    queryKey: ['error-market-data', selectedGrade, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('error_coins_market_data')
        .select(`
          *,
          error_coins_knowledge (
            error_name,
            error_type,
            error_category,
            rarity_score
          )
        `)
        .order('market_value_avg', { ascending: false });

      if (selectedGrade !== 'all') {
        query = query.eq('grade', selectedGrade);
      }

      if (priceRange.min) {
        query = query.gte('market_value_avg', parseFloat(priceRange.min));
      }

      if (priceRange.max) {
        query = query.lte('market_value_avg', parseFloat(priceRange.max));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const { data: priceStats } = useQuery({
    queryKey: ['market-price-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select('market_value_avg, market_value_high, market_value_low, premium_percentage, market_trend');

      if (error) throw error;

      const values = data?.map(d => d.market_value_avg).filter(v => v) || [];
      const premiums = data?.map(d => d.premium_percentage).filter(v => v) || [];
      const trends = data?.map(d => d.market_trend) || [];

      return {
        avgPrice: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        maxPrice: Math.max(...values.filter(v => v)),
        minPrice: Math.min(...values.filter(v => v)),
        avgPremium: premiums.length > 0 ? premiums.reduce((a, b) => a + b, 0) / premiums.length : 0,
        totalRecords: data?.length || 0,
        trendingUp: trends.filter(t => t === 'increasing').length,
        trendingDown: trends.filter(t => t === 'decreasing').length
      };
    }
  });

  const refreshMarketData = async () => {
    const { error } = await supabase.rpc('execute_ai_command', {
      p_command_id: 'market-data-refresh',
      p_input_data: { source: 'heritage_auctions' }
    });

    if (error) {
      toast.error('Failed to refresh market data');
    } else {
      toast.success('Market data refresh initiated');
      refetch();
    }
  };

  const grades = ['all', 'G-4', 'VG-8', 'F-12', 'VF-20', 'XF-40', 'AU-50', 'MS-60', 'MS-63', 'MS-65', 'MS-67'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Market Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${priceStats?.avgPrice?.toFixed(2) || '0'}
            </div>
            <p className="text-xs text-muted-foreground">Across all error types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${priceStats?.maxPrice?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">Peak error coin value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Premium</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {priceStats?.avgPremium?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">Over normal value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Records</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {priceStats?.totalRecords || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active data points</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Grade Filter</label>
          <select 
            value={selectedGrade} 
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>
                {grade === 'all' ? 'All Grades' : grade}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <div className="flex gap-2">
            <Input
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24"
            />
            <Input
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24"
            />
          </div>
        </div>

        <Button onClick={refreshMarketData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Market Data Grid */}
      <div className="space-y-4">
        {marketData.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {item.error_coins_knowledge?.error_name || 'Unknown Error'}
                  </CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{item.grade}</Badge>
                    <Badge variant="outline">{item.error_coins_knowledge?.error_type}</Badge>
                    {item.market_trend && (
                      <Badge variant={item.market_trend === 'increasing' ? 'default' : 
                                    item.market_trend === 'decreasing' ? 'destructive' : 'secondary'}>
                        {item.market_trend === 'increasing' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {item.market_trend === 'decreasing' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {item.market_trend}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${item.market_value_avg?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Value</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium">Low Value</div>
                  <div className="text-lg text-blue-600">
                    ${item.market_value_low?.toLocaleString() || '0'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">High Value</div>
                  <div className="text-lg text-red-600">
                    ${item.market_value_high?.toLocaleString() || '0'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Premium</div>
                  <div className="text-lg text-purple-600">
                    {item.premium_percentage?.toFixed(1) || '0'}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Data Confidence</div>
                  <div className="text-lg text-orange-600">
                    {((item.data_confidence || 0.5) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {item.regional_pricing && Object.keys(item.regional_pricing).length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Regional Pricing</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(item.regional_pricing).map(([region, price]) => (
                      <Badge key={region} variant="outline">
                        {region}: ${price as number}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.source_references?.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Data Sources</div>
                  <div className="flex gap-2 flex-wrap">
                    {item.source_references.map((source, idx) => (
                      <Badge key={idx} variant="secondary">{source}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {marketData.length === 0 && (
        <Card>
          <CardContent className="text-center py-16">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Market Data Found</h3>
            <p className="text-muted-foreground mb-4">
              No market data matches your current filters. Try adjusting the grade or price range.
            </p>
            <Button onClick={refreshMarketData}>
              Refresh Market Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorMarketDataManager;
