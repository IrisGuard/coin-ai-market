import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrendingUp, Brain, Target, Activity, Plus, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminPredictionsTab = () => {
  const [newModelName, setNewModelName] = useState('');
  const [newModelType, setNewModelType] = useState('');
  const [newModelDescription, setNewModelDescription] = useState('');
  const queryClient = useQueryClient();

  // Use existing prediction_models table
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['prediction-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Use AI performance metrics as prediction data
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['ai-performance-predictions'],
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

  const createModelMutation = useMutation({
    mutationFn: async (modelData: any) => {
      const { error } = await supabase
        .from('prediction_models')
        .insert([{
          name: modelData.name,
          model_type: modelData.type,
          description: modelData.description,
          is_active: true
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prediction-models'] });
      toast.success('Prediction model created successfully');
      setNewModelName('');
      setNewModelType('');
      setNewModelDescription('');
    },
    onError: (error) => {
      toast.error('Failed to create prediction model');
    }
  });

  const isLoading = modelsLoading || performanceLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = {
    totalModels: models?.length || 0,
    activeModels: models?.filter(m => m.is_active).length || 0,
    totalPredictions: performanceData?.length || 0,
    avgAccuracy: performanceData?.reduce((sum, p) => sum + p.metric_value, 0) / (performanceData?.length || 1) || 0
  };

  // Prepare chart data from performance metrics
  const chartData = performanceData?.slice(0, 20).map((metric, index) => ({
    name: `Metric ${index + 1}`,
    value: metric.metric_value,
    date: new Date(metric.recorded_at).toLocaleDateString()
  })) || [];

  const handleCreateModel = () => {
    if (!newModelName || !newModelType) {
      toast.error('Please fill in all required fields');
      return;
    }

    createModelMutation.mutate({
      name: newModelName,
      type: newModelType,
      description: newModelDescription
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Total Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalModels}</div>
            <Badge className="bg-blue-100 text-blue-800 mt-1">Models</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Active Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeModels}</div>
            <Badge className="bg-green-100 text-green-800 mt-1">Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalPredictions}</div>
            <Badge className="bg-purple-100 text-purple-800 mt-1">Generated</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(stats.avgAccuracy * 100).toFixed(1)}%
            </div>
            <Badge className="bg-orange-100 text-orange-800 mt-1">Accuracy</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Prediction Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Create New Model */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Prediction Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Enter model name"
              />
            </div>
            <div>
              <Label htmlFor="model-type">Model Type</Label>
              <Select value={newModelType} onValueChange={setNewModelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend_analysis">Trend Analysis</SelectItem>
                  <SelectItem value="market_prediction">Market Prediction</SelectItem>
                  <SelectItem value="price_forecast">Price Forecast</SelectItem>
                  <SelectItem value="rarity_assessment">Rarity Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="model-description">Description</Label>
            <Textarea
              id="model-description"
              value={newModelDescription}
              onChange={(e) => setNewModelDescription(e.target.value)}
              placeholder="Enter model description"
              rows={3}
            />
          </div>
          <Button 
            onClick={handleCreateModel}
            disabled={createModelMutation.isPending}
            className="w-full md:w-auto"
          >
            {createModelMutation.isPending ? 'Creating...' : 'Create Model'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Models */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Prediction Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models?.map((model) => (
              <div key={model.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{model.name}</h4>
                  <p className="text-sm text-gray-600">
                    Type: {model.model_type} • Created: {new Date(model.created_at).toLocaleDateString()}
                  </p>
                  {model.description && (
                    <p className="text-sm text-gray-500 mt-1">{model.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={model.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {model.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Performance Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData?.slice(0, 10).map((metric) => (
              <div key={metric.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{metric.metric_name}</h4>
                  <p className="text-sm text-gray-600">
                    {metric.metric_type} • {new Date(metric.recorded_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {(metric.metric_value * 100).toFixed(1)}%
                  </div>
                  {metric.related_id && (
                    <p className="text-xs text-gray-500">Related: {metric.related_id}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPredictionsTab;
