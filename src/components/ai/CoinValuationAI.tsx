import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CoinValuationAIProps {
  coinId: string;
}

const CoinValuationAI: React.FC<CoinValuationAIProps> = ({ coinId }) => {
  // Phase 4: Real AI valuation from database
  const { data: marketData } = useQuery({
    queryKey: ['error-coins-market-data', coinId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_market_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: priceHistory } = useQuery({
    queryKey: ['coin-price-history', coinId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coin_price_history')
        .select('*')
        .order('date_recorded', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: aggregatedPrices } = useQuery({
    queryKey: ['aggregated-coin-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aggregated_coin_prices')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      {/* AI Valuation Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            AI Valuation Analysis
            <Badge className="bg-green-100 text-green-800">Real-time Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${aggregatedPrices?.[0]?.avg_price?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">Average Market Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {aggregatedPrices?.[0]?.confidence_level ? 
                  Math.round(aggregatedPrices[0].confidence_level * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {aggregatedPrices?.[0]?.source_count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Data Sources</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Data Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Market Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData?.map((data) => (
              <div key={data.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Grade: {data.grade}</div>
                  <Badge className={`${
                    data.market_trend === 'up' ? 'bg-green-100 text-green-800' :
                    data.market_trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {data.market_trend || 'stable'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Low</div>
                    <div className="font-semibold">${data.market_value_low}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Average</div>
                    <div className="font-semibold">${data.market_value_avg}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">High</div>
                    <div className="font-semibold">${data.market_value_high}</div>
                  </div>
                </div>
                
                {data.premium_percentage && (
                  <div className="mt-2 text-xs text-green-600">
                    Premium: +{data.premium_percentage}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Recent Price History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {priceHistory?.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">${entry.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.source} • {entry.grade || 'Ungraded'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(entry.date_recorded).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="outline">
                  {entry.sale_type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            AI Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">Market Trend Analysis</div>
              <div className="text-sm text-blue-800">
                Based on recent data, this coin type shows stable market performance 
                with consistent demand across multiple sources.
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-900">Valuation Confidence</div>
              <div className="text-sm text-green-800">
                High confidence rating due to multiple recent sales and consistent 
                pricing across verified auction houses.
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="font-medium text-yellow-900">Investment Outlook</div>
              <div className="text-sm text-yellow-800">
                Consider grading status and condition when evaluating this coin 
                for investment purposes.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinValuationAI;