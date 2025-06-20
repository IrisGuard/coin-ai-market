
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Target, Brain } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SmartPortfolioAI = () => {
  // Use existing coins table for portfolio data
  const { data: portfolioCoins } = useQuery({
    queryKey: ['portfolio-coins'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Use AI performance metrics for AI insights
  const { data: aiInsights } = useQuery({
    queryKey: ['portfolio-ai-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Use market analytics for market data
  const { data: marketData } = useQuery({
    queryKey: ['portfolio-market-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate portfolio metrics
  const portfolioValue = portfolioCoins?.reduce((sum, coin) => sum + (coin.price || 0), 0) || 0;
  const avgAIConfidence = aiInsights?.reduce((sum, insight) => sum + insight.metric_value, 0) / (aiInsights?.length || 1) || 0;
  const marketTrend = marketData?.[0]?.metric_value || 0;

  // Prepare chart data
  const chartData = marketData?.slice(0, 10).map((item, index) => ({
    name: `Period ${index + 1}`,
    value: item.metric_value,
    trend: item.trend_analysis ? 'up' : 'stable'
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Smart Portfolio AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${portfolioValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(avgAIConfidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {marketTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className="text-lg font-semibold">
                  {marketTrend > 0 ? '+' : ''}{(marketTrend * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Market Trend</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights?.slice(0, 3).map((insight) => (
              <div key={insight.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{insight.metric_name}</h4>
                  <p className="text-sm text-gray-600">
                    Type: {insight.metric_type}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-purple-100 text-purple-800">
                    {(insight.metric_value * 100).toFixed(0)}% Confidence
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Coin Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioCoins?.slice(0, 5).map((coin) => (
              <div key={coin.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{coin.name}</h4>
                  <p className="text-sm text-gray-600">
                    {coin.year} • Grade: {coin.grade}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    ${coin.price?.toLocaleString()}
                  </div>
                  <Badge variant="outline">{coin.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartPortfolioAI;
