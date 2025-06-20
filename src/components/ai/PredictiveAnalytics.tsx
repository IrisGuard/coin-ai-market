
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Brain, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PredictiveAnalytics = () => {
  // Use existing AI performance metrics instead of ai_predictions
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['predictive-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Use market analytics for trend data
  const { data: marketTrends } = useQuery({
    queryKey: ['market-trends-analytics'],
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate predictive insights
  const insights = {
    totalAnalyses: analyticsData?.length || 0,
    avgConfidence: analyticsData?.reduce((sum, a) => sum + a.metric_value, 0) / (analyticsData?.length || 1) || 0,
    trendAccuracy: marketTrends?.length || 0,
    activeModels: new Set(analyticsData?.map(a => a.metric_type)).size || 0
  };

  // Prepare chart data
  const chartData = analyticsData?.slice(0, 10).map((metric, index) => ({
    name: `Analysis ${index + 1}`,
    accuracy: metric.metric_value,
    type: metric.metric_type
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Predictive Analytics Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{insights.totalAnalyses}</div>
              <div className="text-sm text-muted-foreground">Total Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(insights.avgConfidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{insights.trendAccuracy}</div>
              <div className="text-sm text-muted-foreground">Market Trends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{insights.activeModels}</div>
              <div className="text-sm text-muted-foreground">Active Models</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Accuracy Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData?.slice(0, 5).map((prediction) => (
              <div key={prediction.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{prediction.metric_name}</h4>
                  <p className="text-sm text-gray-600">
                    Model: {prediction.metric_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(prediction.recorded_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-purple-100 text-purple-800 mb-2">
                    {(prediction.metric_value * 100).toFixed(1)}% Accuracy
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Value: {prediction.metric_value.toFixed(3)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Trend Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marketTrends?.slice(0, 5).map((trend) => (
              <div key={trend.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{trend.metric_name}</h4>
                  <p className="text-sm text-gray-600">Period: {trend.time_period}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold">
                      {(trend.metric_value * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
