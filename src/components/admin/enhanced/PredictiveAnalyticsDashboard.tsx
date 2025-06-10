
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, Brain, Target, BarChart3, 
  Zap, Calendar, Settings, Play
} from 'lucide-react';
import { usePredictionModels, useGeneratePrediction } from '@/hooks/admin/useEnhancedAIBrain';

const PredictiveAnalyticsDashboard = () => {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [inputData, setInputData] = useState<string>('{}');
  const [predictionResults, setPredictionResults] = useState<any[]>([]);
  
  const { data: models, isLoading } = usePredictionModels();
  const generatePrediction = useGeneratePrediction();

  const handleGeneratePrediction = async () => {
    if (!selectedModel) return;
    
    try {
      const parsedInput = JSON.parse(inputData);
      const result = await generatePrediction.mutateAsync({
        modelId: selectedModel,
        inputData: parsedInput
      });
      
      setPredictionResults(prev => [result, ...prev.slice(0, 4)]);
      setInputData('{}');
    } catch (error) {
      console.error('Failed to generate prediction:', error);
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'trend_analysis': return <TrendingUp className="w-4 h-4" />;
      case 'market_prediction': return <BarChart3 className="w-4 h-4" />;
      case 'user_behavior': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'trend_analysis': return 'bg-blue-100 text-blue-800';
      case 'market_prediction': return 'bg-green-100 text-green-800';
      case 'user_behavior': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccuracyColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading prediction models...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Predictive Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Selection and Prediction Generation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Generate Prediction</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose a model...</option>
                  {models?.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.model_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Input Data (JSON)</label>
                <Textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder='{"data_points": [1, 2, 3], "timeframe": "7d"}'
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGeneratePrediction}
                disabled={!selectedModel || generatePrediction.isPending}
                className="w-full"
              >
                {generatePrediction.isPending ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Prediction
                  </>
                )}
              </Button>
            </div>

            {/* Recent Predictions */}
            <div className="space-y-4">
              <h3 className="font-semibold">Recent Predictions</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {predictionResults.map((result, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{result.model_name}</span>
                          <Badge variant="outline">
                            {(result.confidence_score * 100).toFixed(1)}% confidence
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(result.predicted_value, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {predictionResults.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No predictions generated yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Models */}
          <div className="space-y-4">
            <h3 className="font-semibold">Available Prediction Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models?.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getModelTypeIcon(model.model_type)}
                          <h4 className="font-medium">{model.name}</h4>
                        </div>
                        <Badge className={getModelTypeColor(model.model_type)}>
                          {model.model_type.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        Target: <span className="font-medium">{model.target_metric}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Accuracy:</span>
                        <span className={`font-medium ${getAccuracyColor(model.accuracy_score)}`}>
                          {(model.accuracy_score * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Last Trained:</span>
                        <span className="font-medium">
                          {model.last_trained 
                            ? new Date(model.last_trained).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedModel(model.id)}
                        className="w-full"
                      >
                        <Target className="w-3 h-3 mr-1" />
                        Select Model
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {models?.filter(m => m.is_active).length || 0}
            </div>
            <div className="text-sm text-gray-600">Active Models</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {models?.filter(m => m.model_type === 'trend_analysis').length || 0}
            </div>
            <div className="text-sm text-gray-600">Trend Analysis</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {models?.filter(m => m.model_type === 'market_prediction').length || 0}
            </div>
            <div className="text-sm text-gray-600">Market Prediction</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {models?.reduce((sum, m) => sum + m.accuracy_score, 0) ? 
                ((models?.reduce((sum, m) => sum + m.accuracy_score, 0) / models?.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Accuracy</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
