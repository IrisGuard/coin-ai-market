
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, Brain, BarChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PredictionModelsSection = () => {
  const { data: models, isLoading } = useQuery({
    queryKey: ['prediction-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

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

  const getTrendIcon = (accuracy: number) => {
    if (accuracy > 0.9) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (accuracy > 0.7) return <BarChart className="h-4 w-4 text-blue-500" />;
    return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Prediction Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {models?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No prediction models configured yet
            </div>
          ) : (
            models?.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-muted-foreground">Target: {model.target_metric?.replace('_', ' ')}</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant={model.is_active ? "default" : "secondary"}>
                      {model.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge className={getModelTypeColor(model.model_type)}>
                      {model.model_type?.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      Accuracy: {Math.round((model.accuracy_score || 0) * 100)}%
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTrendIcon(model.accuracy_score || 0)}
                      {model.accuracy_score > 0.8 ? 'High' : model.accuracy_score > 0.6 ? 'Medium' : 'Low'}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionModelsSection;
