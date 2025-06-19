
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrendData {
  id: string;
  metric_name: string;
  metric_value: number;
  trend_analysis: any;
  recorded_at: string;
  time_period: string;
}

const TrendAnalyzer = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Fetch trend data
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['trend-analysis', timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .eq('time_period', timeframe)
        .order('recorded_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as TrendData[] || [];
    }
  });

  const runTrendAnalysis = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('trend-analysis-generator', {
        body: { 
          timeframe,
          includeExternalFactors: true,
          analysisDepth: 'comprehensive'
        }
      });
      
      if (error) throw error;
      console.log('Trend analysis completed:', data);
    } catch (error) {
      console.error('Trend analysis failed:', error);
    }
  };

  const getTrendDirection = (trendAnalysis: any) => {
    if (!trendAnalysis) return 'stable';
    const trend = trendAnalysis.direction || 'stable';
    return trend;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
      case 'increasing':
        return 'text-green-600';
      case 'down':
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const upTrends = trendData?.filter(t => getTrendDirection(t.trend_analysis) === 'up').length || 0;
  const downTrends = trendData?.filter(t => getTrendDirection(t.trend_analysis) === 'down').length || 0;
  const stableTrends = trendData?.filter(t => getTrendDirection(t.trend_analysis) === 'stable').length || 0;

  return (
    <div className="space-y-6">
      {/* Trend Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-600" />
            Market Trend Analyzer
            <Badge variant="outline">Real-time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{upTrends}</p>
              <p className="text-sm text-muted-foreground">Rising Trends</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{downTrends}</p>
              <p className="text-sm text-muted-foreground">Falling Trends</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{stableTrends}</p>
              <p className="text-sm text-muted-foreground">Stable Trends</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{trendData?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button
              variant={timeframe === 'daily' ? 'default' : 'outline'}
              onClick={() => setTimeframe('daily')}
            >
              Daily Trends
            </Button>
            <Button
              variant={timeframe === 'weekly' ? 'default' : 'outline'}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly Trends
            </Button>
            <Button
              variant={timeframe === 'monthly' ? 'default' : 'outline'}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly Trends
            </Button>
          </div>
          
          <Button onClick={runTrendAnalysis} className="w-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Comprehensive Trend Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Trend Data */}
      {!isLoading && trendData && trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Market Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendData.map((trend) => {
                const direction = getTrendDirection(trend.trend_analysis);
                return (
                  <div key={trend.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(direction)}
                        <span className="font-medium">{trend.metric_name}</span>
                        <Badge variant="outline" className={getTrendColor(direction)}>
                          {direction}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(trend.recorded_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Value</p>
                        <p className="text-lg font-semibold">{trend.metric_value}</p>
                      </div>
                      
                      {trend.trend_analysis && (
                        <div>
                          <p className="text-sm text-muted-foreground">Trend Analysis</p>
                          <div className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                            <pre>{JSON.stringify(trend.trend_analysis, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">Loading trend analysis...</div>
          </CardContent>
        </Card>
      )}

      {!isLoading && (!trendData || trendData.length === 0) && (
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Trend Data Available</h3>
            <p className="text-muted-foreground mb-4">
              No trend data found for the selected timeframe. Generate a new analysis to populate data.
            </p>
            <Button onClick={runTrendAnalysis}>
              Generate Initial Trend Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrendAnalyzer;
