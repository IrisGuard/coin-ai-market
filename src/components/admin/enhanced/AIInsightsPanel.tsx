
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, Zap } from 'lucide-react';
import { useAIInsights } from '@/hooks/admin/useAdvancedAnalytics';

const AIInsightsPanel = () => {
  const { data: insights, isLoading } = useAIInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'market_opportunity': return <TrendingUp className="w-4 h-4" />;
      case 'user_behavior': return <Target className="w-4 h-4" />;
      case 'inventory_optimization': return <AlertTriangle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading AI insights...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Advanced machine learning algorithms analyze your marketplace data to provide actionable insights.
          </p>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Refresh Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights?.recommendations?.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(rec.type)}
                    <h4 className="font-medium">{rec.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(rec.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Confidence:</span>
                  <Progress value={rec.confidence * 100} className="h-2 flex-1" />
                  <span className="text-xs font-medium">{Math.round(rec.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights?.predictions?.map((pred, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">{pred.category}</h4>
                  <Badge variant="outline" className="text-blue-700">
                    {pred.timeframe}
                  </Badge>
                </div>
                <p className="text-sm text-blue-800 mb-3">{pred.prediction}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600">Confidence:</span>
                  <Progress value={pred.confidence * 100} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-blue-900">
                    {Math.round(pred.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">94.2%</div>
              <div className="text-sm text-gray-600">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">1.2s</div>
              <div className="text-sm text-gray-600">Avg Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">156</div>
              <div className="text-sm text-gray-600">Daily Analyses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPanel;
