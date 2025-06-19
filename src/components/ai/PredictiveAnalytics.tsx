
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Brain, LineChart, Activity } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PredictiveAnalytics = () => {
  const [predictionScope, setPredictionScope] = useState<'short' | 'medium' | 'long'>('medium');
  const queryClient = useQueryClient();

  // Fetch prediction models
  const { data: models, isLoading } = useQuery({
    queryKey: ['prediction-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent predictions
  const { data: predictions } = useQuery({
    queryKey: ['recent-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_predictions')
        .select('*')
        .order('prediction_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  // Generate prediction mutation
  const generatePrediction = useMutation({
    mutationFn: async (modelId: string) => {
      const { data, error } = await supabase.functions.invoke('predictive-analytics-processor', {
        body: { 
          modelId, 
          scope: predictionScope,
          includeMarketFactors: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-predictions'] });
    }
  });

  const activeModels = models?.filter(m => m.is_active) || [];
  const avgAccuracy = predictions?.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / (predictions?.length || 1);

  return (
    <div className="space-y-6">
      {/* Predictive Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Predictive Analytics Engine
            <Badge variant="outline">Advanced ML</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{activeModels.length}</p>
              <p className="text-sm text-muted-foreground">Active Models</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((avgAccuracy || 0) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Accuracy</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <LineChart className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{predictions?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Predictions</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Brain className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">Live</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Prediction Scope</label>
              <div className="flex gap-2">
                <Button
                  variant={predictionScope === 'short' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPredictionScope('short')}
                >
                  Short-term (1-7 days)
                </Button>
                <Button
                  variant={predictionScope === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPredictionScope('medium')}
                >
                  Medium-term (1-4 weeks)
                </Button>
                <Button
                  variant={predictionScope === 'long' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPredictionScope('long')}
                >
                  Long-term (1-6 months)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Models */}
      {!isLoading && activeModels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeModels.map((model) => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{model.name}</h4>
                    <Badge variant="outline">{model.model_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {model.description}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => generatePrediction.mutate(model.id)}
                    disabled={generatePrediction.isPending}
                    className="w-full"
                  >
                    {generatePrediction.isPending ? 'Generating...' : 'Generate Prediction'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Predictions */}
      {predictions && predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{prediction.prediction_type}</Badge>
                      <span className="text-sm font-medium">
                        {Math.round((prediction.confidence_score || 0) * 100)}% confidence
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(prediction.prediction_date).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <strong>Prediction:</strong>
                      <pre className="mt-1 text-xs overflow-auto">
                        {JSON.stringify(prediction.predicted_value, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">Loading predictive models...</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictiveAnalytics;
