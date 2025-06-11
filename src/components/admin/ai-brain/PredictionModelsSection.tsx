
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, Brain, BarChart } from 'lucide-react';

const PredictionModelsSection = () => {
  // Mock prediction models data
  const mockModels = [
    {
      id: '1',
      name: 'Coin Value Predictor',
      target_metric: 'market_value',
      model_type: 'neural_network',
      is_active: true,
      accuracy_score: 0.942,
      predictions_made: 1856,
      last_trained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      confidence_avg: 0.89,
      performance_trend: 'improving'
    },
    {
      id: '2',
      name: 'Market Trend Forecaster',
      target_metric: 'price_trend',
      model_type: 'ensemble',
      is_active: true,
      accuracy_score: 0.876,
      predictions_made: 734,
      last_trained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      confidence_avg: 0.82,
      performance_trend: 'stable'
    },
    {
      id: '3',
      name: 'Rarity Assessment Model',
      target_metric: 'rarity_score',
      model_type: 'random_forest',
      is_active: true,
      accuracy_score: 0.918,
      predictions_made: 432,
      last_trained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      confidence_avg: 0.91,
      performance_trend: 'improving'
    },
    {
      id: '4',
      name: 'Auction Price Predictor',
      target_metric: 'auction_final_price',
      model_type: 'gradient_boosting',
      is_active: true,
      accuracy_score: 0.863,
      predictions_made: 289,
      last_trained: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      confidence_avg: 0.78,
      performance_trend: 'stable'
    },
    {
      id: '5',
      name: 'Error Coin Value Model',
      target_metric: 'error_premium',
      model_type: 'deep_learning',
      is_active: true,
      accuracy_score: 0.895,
      predictions_made: 156,
      last_trained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      confidence_avg: 0.86,
      performance_trend: 'improving'
    },
    {
      id: '6',
      name: 'User Engagement Predictor',
      target_metric: 'user_activity',
      model_type: 'lstm',
      is_active: false,
      accuracy_score: 0.754,
      predictions_made: 98,
      last_trained: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      confidence_avg: 0.68,
      performance_trend: 'declining'
    }
  ];

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'neural_network': return 'bg-purple-100 text-purple-800';
      case 'ensemble': return 'bg-blue-100 text-blue-800';
      case 'random_forest': return 'bg-green-100 text-green-800';
      case 'gradient_boosting': return 'bg-yellow-100 text-yellow-800';
      case 'deep_learning': return 'bg-red-100 text-red-800';
      case 'lstm': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <BarChart className="h-4 w-4 text-blue-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <BarChart className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Prediction Models
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockModels.map((model) => (
            <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{model.name}</div>
                <div className="text-sm text-muted-foreground">Target: {model.target_metric.replace('_', ' ')}</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant={model.is_active ? "default" : "secondary"}>
                    {model.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge className={getModelTypeColor(model.model_type)}>
                    {model.model_type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    Accuracy: {Math.round(model.accuracy_score * 100)}%
                  </Badge>
                  <Badge variant="outline">
                    Predictions: {model.predictions_made}
                  </Badge>
                  <Badge variant="outline">
                    Confidence: {Math.round(model.confidence_avg * 100)}%
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTrendIcon(model.performance_trend)}
                    {model.performance_trend}
                  </Badge>
                  <Badge variant="outline">
                    Trained: {getTimeAgo(model.last_trained)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <BarChart className="h-4 w-4" />
                  Analytics
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
                <Button size="sm">
                  <Brain className="h-4 w-4" />
                  Retrain
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionModelsSection;
