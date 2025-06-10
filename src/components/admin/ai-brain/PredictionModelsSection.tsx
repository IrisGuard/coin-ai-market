
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Settings } from 'lucide-react';

const PredictionModelsSection = () => {
  // Get Prediction Models
  const { data: predictionModels, isLoading: modelsLoading } = useQuery({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Models</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modelsLoading ? (
            <div className="text-center py-8">Loading prediction models...</div>
          ) : predictionModels?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No prediction models found
            </div>
          ) : (
            predictionModels?.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-muted-foreground">Target: {model.target_metric}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={model.is_active ? "default" : "secondary"}>
                      {model.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{model.model_type}</Badge>
                    <Badge variant="outline">
                      Accuracy: {Math.round((model.accuracy_score || 0) * 100)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                    Configure
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
