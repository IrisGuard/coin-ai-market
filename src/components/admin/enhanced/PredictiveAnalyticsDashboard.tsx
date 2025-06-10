
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Brain, Target } from 'lucide-react';

const PredictiveAnalyticsDashboard = () => {
  // Mock prediction models data
  const predictionModels = [
    {
      id: '1',
      name: 'Market Trend Predictor',
      model_type: 'trend_analysis',
      accuracy_score: 0.87,
      last_trained: new Date(Date.now() - 24 * 60 * 60 * 1000),
      is_active: true,
      predictions_count: 145
    },
    {
      id: '2',
      name: 'Price Forecast Model',
      model_type: 'price_prediction',
      accuracy_score: 0.82,
      last_trained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      is_active: true,
      predictions_count: 89
    },
    {
      id: '3',
      name: 'Demand Forecaster',
      model_type: 'demand_analysis',
      accuracy_score: 0.75,
      last_trained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      is_active: false,
      predictions_count: 32
    }
  ];

  // Mock recent predictions
  const recentPredictions = [
    {
      id: '1',
      model_name: 'Market Trend Predictor',
      prediction_type: 'trend_analysis',
      predicted_value: { trend: 'increasing', percentage: 15.5 },
      confidence_score: 0.89,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      model_name: 'Price Forecast Model',
      prediction_type: 'price_prediction',
      predicted_value: { predicted_price: 1250.75, range_low: 1100, range_high: 1400 },
      confidence_score: 0.83,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      model_name: 'Demand Forecaster',
      prediction_type: 'demand_analysis',
      predicted_value: { demand_level: 'high', category: 'gold_coins' },
      confidence_score: 0.76,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  const getAccuracyColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Predictive Analytics</h3>
          <p className="text-sm text-gray-600">AI-powered predictions and forecasting</p>
        </div>
        <Button>
          <Brain className="w-4 h-4 mr-2" />
          Train New Model
        </Button>
      </div>

      {/* Model Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictionModels.map((model) => (
          <Card key={model.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                <Badge variant={model.is_active ? 'default' : 'secondary'}>
                  {model.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className={`font-medium ${getAccuracyColor(model.accuracy_score)}`}>
                  {(model.accuracy_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Predictions</span>
                <span className="font-medium">{model.predictions_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Trained</span>
                <span className="text-sm">{model.last_trained.toLocaleDateString()}</span>
              </div>
              <Button size="sm" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Generate Prediction
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPredictions.map((prediction) => (
              <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{prediction.model_name}</h4>
                    <Badge variant="outline">{prediction.prediction_type}</Badge>
                    <Badge className={getConfidenceColor(prediction.confidence_score)}>
                      {(prediction.confidence_score * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {prediction.prediction_type === 'trend_analysis' && (
                      <div className="flex items-center gap-2">
                        {prediction.predicted_value.trend === 'increasing' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span>
                          Trend: {prediction.predicted_value.trend} ({prediction.predicted_value.percentage}%)
                        </span>
                      </div>
                    )}
                    {prediction.prediction_type === 'price_prediction' && (
                      <span>
                        Predicted Price: ${prediction.predicted_value.predicted_price} 
                        (Range: ${prediction.predicted_value.range_low} - ${prediction.predicted_value.range_high})
                      </span>
                    )}
                    {prediction.prediction_type === 'demand_analysis' && (
                      <span>
                        Demand Level: {prediction.predicted_value.demand_level} for {prediction.predicted_value.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {prediction.created_at.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
