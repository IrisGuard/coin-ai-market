
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Target, Brain } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AIPredictionsManager = () => {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['ai-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const stats = {
    total: predictions?.length || 0,
    highConfidence: predictions?.filter(p => p.confidence_score >= 0.8).length || 0,
    avgConfidence: predictions?.reduce((sum, p) => sum + p.confidence_score, 0) / (predictions?.length || 1) || 0,
    types: new Set(predictions?.map(p => p.prediction_type)).size || 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            AI Predictions Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.highConfidence}</div>
              <div className="text-sm text-muted-foreground">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(stats.avgConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.types}</div>
              <div className="text-sm text-muted-foreground">Prediction Types</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Predicted Value</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actual Value</TableHead>
                <TableHead>Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions?.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell>
                    <Badge variant="outline">{prediction.prediction_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">
                      {JSON.stringify(prediction.predicted_value)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getConfidenceColor(prediction.confidence_score)}>
                      {(prediction.confidence_score * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(prediction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {prediction.actual_value ? (
                      <div className="font-mono text-sm">
                        {JSON.stringify(prediction.actual_value)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {prediction.accuracy_check ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Unverified</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPredictionsManager;
