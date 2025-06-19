
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Brain, BarChart3, Globe, DollarSign, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MarketIntelligencePanel = () => {
  const [analysisType, setAnalysisType] = useState<'sentiment' | 'trends' | 'predictions'>('sentiment');

  // Fetch real market intelligence data
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['market-intelligence', analysisType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .eq('metric_type', analysisType)
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch AI predictions
  const { data: predictions } = useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    }
  });

  const runMarketAnalysis = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('market-intelligence-engine', {
        body: { analysisType, includeGlobalData: true }
      });
      
      if (error) throw error;
      console.log('Market analysis completed:', data);
    } catch (error) {
      console.error('Market analysis failed:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading market intelligence...</div>
        </CardContent>
      </Card>
    );
  }

  const latestData = marketData?.[0];
  const confidence = predictions?.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / (predictions?.length || 1);

  return (
    <div className="space-y-6">
      {/* Market Intelligence Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Advanced AI Market Intelligence
            <Badge variant="outline">Phase 17</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {marketData?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Active Reports</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((confidence || 0) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">AI Confidence</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">
                {predictions?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Predictions</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Globe className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">Live</p>
              <p className="text-sm text-muted-foreground">Global Data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              variant={analysisType === 'sentiment' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('sentiment')}
            >
              Sentiment Analysis
            </Button>
            <Button 
              variant={analysisType === 'trends' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('trends')}
            >
              Trend Analysis
            </Button>
            <Button 
              variant={analysisType === 'predictions' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('predictions')}
            >
              Price Predictions
            </Button>
          </div>
          
          <Button onClick={runMarketAnalysis} className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Run Advanced AI Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Latest Market Data */}
      {latestData && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Market Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Current Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  Value: {latestData.metric_value}
                </p>
                <p className="text-sm text-muted-foreground">
                  Period: {latestData.time_period}
                </p>
                <p className="text-sm text-muted-foreground">
                  Recorded: {new Date(latestData.recorded_at).toLocaleString()}
                </p>
              </div>
              
              {latestData.trend_analysis && (
                <div>
                  <h4 className="font-semibold mb-2">Trend Analysis</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(latestData.trend_analysis, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Predictions */}
      {predictions && predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{prediction.prediction_type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((prediction.confidence_score || 0) * 100)}% confidence
                    </span>
                  </div>
                  <div className="text-sm">
                    <pre className="bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(prediction.predicted_value, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketIntelligencePanel;
