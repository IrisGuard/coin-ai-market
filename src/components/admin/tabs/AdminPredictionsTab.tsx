
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, Target, Activity, Plus, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PredictionModel {
  id: string;
  name: string;
  model_type: string;
  target_metric: string;
  is_active: boolean;
  accuracy_score: number;
  last_trained: string | null;
  created_at: string;
}

interface CreateModelParams {
  name: string;
  model_type: string;
  target_metric: string;
  model_parameters: any;
  training_data_config: any;
}

const AdminPredictionsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState<CreateModelParams>({
    name: '',
    model_type: 'trend_analysis',
    target_metric: '',
    model_parameters: {},
    training_data_config: {}
  });

  const queryClient = useQueryClient();

  // Prediction Models Query
  const { data: predictionModels = [], isLoading } = useQuery({
    queryKey: ['admin-prediction-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // AI Predictions Query
  const { data: aiPredictions = [] } = useQuery({
    queryKey: ['admin-ai-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_predictions')
        .select(`
          *,
          prediction_models (
            name,
            model_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Prediction Statistics
  const { data: predictionStats } = useQuery({
    queryKey: ['admin-prediction-stats'],
    queryFn: async () => {
      const totalModels = predictionModels.length;
      const activeModels = predictionModels.filter(model => model.is_active).length;
      const avgAccuracy = predictionModels.length > 0 
        ? predictionModels.reduce((sum, model) => sum + (model.accuracy_score || 0), 0) / predictionModels.length 
        : 0;
      const predictionsToday = aiPredictions.filter(prediction => 
        new Date(prediction.created_at).toDateString() === new Date().toDateString()
      ).length;
      
      return {
        totalModels,
        activeModels,
        avgAccuracy: Math.round(avgAccuracy * 100),
        predictionsToday
      };
    },
    enabled: predictionModels.length > 0 || aiPredictions.length > 0
  });

  // Create Model Mutation
  const createModelMutation = useMutation({
    mutationFn: async (modelData: CreateModelParams) => {
      const { error } = await supabase
        .from('prediction_models')
        .insert([modelData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prediction-models'] });
      setIsCreateDialogOpen(false);
      setNewModel({
        name: '',
        model_type: 'trend_analysis',
        target_metric: '',
        model_parameters: {},
        training_data_config: {}
      });
      toast({
        title: "Success",
        description: "Prediction model created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Generate Prediction Mutation
  const generatePredictionMutation = useMutation({
    mutationFn: async ({ modelId, inputData }: { modelId: string; inputData: any }) => {
      const { data, error } = await supabase.rpc('generate_ai_prediction', {
        model_id: modelId,
        input_data: inputData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-predictions'] });
      toast({
        title: "Success",
        description: "Prediction generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle Model Status Mutation
  const toggleModelMutation = useMutation({
    mutationFn: async ({ modelId, isActive }: { modelId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('prediction_models')
        .update({ is_active: isActive })
        .eq('id', modelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prediction-models'] });
      toast({
        title: "Success",
        description: "Model status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'trend_analysis': return 'bg-blue-100 text-blue-800';
      case 'market_prediction': return 'bg-green-100 text-green-800';
      case 'price_forecast': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredModels = predictionModels.filter(model => {
    const matchesSearch = model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.model_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.target_metric?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || model.model_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateModel = () => {
    createModelMutation.mutate(newModel);
  };

  return (
    <div className="space-y-6">
      {/* Prediction Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictionStats?.totalModels || 0}</div>
            <p className="text-xs text-muted-foreground">Prediction models</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictionStats?.activeModels || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictionStats?.avgAccuracy || 0}%</div>
            <p className="text-xs text-muted-foreground">Model accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Predictions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictionStats?.predictionsToday || 0}</div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Models Management */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Models</CardTitle>
          <CardDescription>Manage AI prediction models and algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="trend_analysis">Trend Analysis</option>
                <option value="market_prediction">Market Prediction</option>
                <option value="price_forecast">Price Forecast</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-prediction-models'] })}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Model
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Prediction Model</DialogTitle>
                    <DialogDescription>Set up a new AI prediction model</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Model Name</Label>
                      <Input
                        id="name"
                        value={newModel.name}
                        onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                        placeholder="Enter model name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model_type">Model Type</Label>
                      <select
                        id="model_type"
                        value={newModel.model_type}
                        onChange={(e) => setNewModel({ ...newModel, model_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="trend_analysis">Trend Analysis</option>
                        <option value="market_prediction">Market Prediction</option>
                        <option value="price_forecast">Price Forecast</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="target_metric">Target Metric</Label>
                      <Input
                        id="target_metric"
                        value={newModel.target_metric}
                        onChange={(e) => setNewModel({ ...newModel, target_metric: e.target.value })}
                        placeholder="e.g., coin_price, market_trend"
                      />
                    </div>
                    <Button 
                      onClick={handleCreateModel}
                      disabled={createModelMutation.isPending}
                      className="w-full"
                    >
                      Create Model
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading prediction models...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target Metric</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Trained</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>
                      <Badge className={getModelTypeColor(model.model_type)}>
                        {model.model_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{model.target_metric}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={(model.accuracy_score || 0) * 100} className="w-16" />
                        <span className="text-sm">{Math.round((model.accuracy_score || 0) * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={model.is_active ? 'default' : 'secondary'}>
                        {model.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {model.last_trained 
                        ? new Date(model.last_trained).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleModelMutation.mutate({ 
                            modelId: model.id, 
                            isActive: !model.is_active 
                          })}
                          disabled={toggleModelMutation.isPending}
                        >
                          {model.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generatePredictionMutation.mutate({ 
                            modelId: model.id, 
                            inputData: {} 
                          })}
                          disabled={generatePredictionMutation.isPending || !model.is_active}
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>Latest AI-generated predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Predicted Value</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aiPredictions.slice(0, 10).map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell className="font-medium">
                    {prediction.prediction_models?.name || 'Unknown Model'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{prediction.prediction_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={(prediction.confidence_score || 0) * 100} className="w-16" />
                      <span className="text-sm">{Math.round((prediction.confidence_score || 0) * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm max-w-[200px] truncate">
                      {typeof prediction.predicted_value === 'object' 
                        ? JSON.stringify(prediction.predicted_value).substring(0, 50) + '...'
                        : String(prediction.predicted_value)
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(prediction.created_at).toLocaleString()}
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

export default AdminPredictionsTab;
