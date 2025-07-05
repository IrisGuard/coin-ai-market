import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Activity,
  BarChart3,
  Zap,
  CheckCircle,
  RefreshCw,
  Download,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PredictiveAnalytics from '@/components/ai/PredictiveAnalytics';
import AIPredictionsManager from '@/components/admin/enhanced/ai/AIPredictionsManager';
import AITrainingManager from '@/components/admin/enhanced/ai/AITrainingManager';
import ErrorCoinDetection from '@/components/ai/ErrorCoinDetection';
import Phase8CompletionValidator from './Phase8CompletionValidator';

const Phase8AIPredictiveIntelligence = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSystemActive, setIsSystemActive] = useState(true);
  const queryClient = useQueryClient();

  // Real-time AI system metrics
  const { data: aiMetrics, isLoading: metricsLoading, refetch } = useQuery({
    queryKey: ['phase8-ai-metrics'],
    queryFn: async () => {
      const [performanceMetrics, trainingData, recognitionCache, automationRules] = await Promise.all([
        supabase.from('ai_performance_metrics').select('*').order('recorded_at', { ascending: false }).limit(10),
        supabase.from('ai_training_data').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('ai_recognition_cache').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('automation_rules').select('*').eq('is_active', true)
      ]);

      return {
        performance: performanceMetrics.data || [],
        training: trainingData.data || [],
        recognition: recognitionCache.data || [],
        automation: automationRules.data || []
      };
    },
    refetchInterval: 5000
  });

  // AI Prediction Models
  const { data: predictionModels } = useQuery({
    queryKey: ['prediction-models-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Generate AI Prediction
  const generatePredictionMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { data, error } = await supabase.rpc('generate_ai_prediction', {
        model_id: modelId,
        input_data: { timestamp: new Date().toISOString(), market_conditions: 'bullish' }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phase8-ai-metrics'] });
      toast.success('AI prediction generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate AI prediction');
    }
  });

  // Execute Automation Rule
  const executeAutomationMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      const { data, error } = await supabase.rpc('execute_automation_rule', {
        rule_id: ruleId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['phase8-ai-metrics'] });
      const result = data as any;
      if (result && typeof result === 'object' && result.actions_executed) {
        toast.success(`Automation rule executed: ${result.actions_executed} actions completed`);
      } else {
        toast.success('Automation rule executed successfully');
      }
    },
    onError: () => {
      toast.error('Failed to execute automation rule');
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSystemToggle = () => {
    setIsSystemActive(!isSystemActive);
    toast.success(`AI Predictive Intelligence ${!isSystemActive ? 'Activated' : 'Deactivated'}`);
  };

  const exportAIReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      phase: 'Phase 8 - AI Predictive Intelligence',
      aiMetrics,
      predictionModels,
      systemStatus: isSystemActive ? 'Active' : 'Inactive',
      insights: {
        totalPerformanceMetrics: aiMetrics?.performance?.length || 0,
        activeModels: predictionModels?.length || 0,
        recognitionCacheSize: aiMetrics?.recognition?.length || 0,
        automationRulesActive: aiMetrics?.automation?.length || 0
      }
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `phase8-ai-intelligence-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const stats = {
    performanceMetrics: aiMetrics?.performance?.length || 0,
    avgConfidence: aiMetrics?.performance?.reduce((sum, p) => sum + p.metric_value, 0) / (aiMetrics?.performance?.length || 1) || 0,
    recognitionCacheSize: aiMetrics?.recognition?.length || 0,
    automationRulesActive: aiMetrics?.automation?.length || 0,
    activeModels: predictionModels?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Phase 8 Header */}
      <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                <Brain className="h-8 w-8" />
                Phase 8: AI-Powered Predictive Intelligence
              </h1>
              <p className="text-muted-foreground mt-2">
                Advanced AI system with predictive analytics, machine learning models, and intelligent automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`flex items-center gap-1 ${isSystemActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isSystemActive ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {isSystemActive ? 'AI System Active' : 'AI System Inactive'}
              </Badge>
              <Button variant="outline" onClick={handleRefresh} disabled={metricsLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleSystemToggle} variant={isSystemActive ? 'destructive' : 'default'}>
                <Zap className="h-4 w-4 mr-2" />
                {isSystemActive ? 'Deactivate' : 'Activate'} AI System
              </Button>
              <Button onClick={exportAIReport}>
                <Download className="h-4 w-4 mr-2" />
                Export AI Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Performance Metrics</span>
            </div>
            <div className="text-2xl font-bold">{stats.performanceMetrics}</div>
            <div className="text-xs text-muted-foreground">Active AI metrics</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Avg Confidence</span>
            </div>
            <div className="text-2xl font-bold">{(stats.avgConfidence * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">AI prediction accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Recognition Cache</span>
            </div>
            <div className="text-2xl font-bold">{stats.recognitionCacheSize}</div>
            <div className="text-xs text-muted-foreground">Cached recognitions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Automation Rules</span>
            </div>
            <div className="text-2xl font-bold">{stats.automationRulesActive}</div>
            <div className="text-xs text-muted-foreground">Active rules</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium">AI Models</span>
            </div>
            <div className="text-2xl font-bold">{stats.activeModels}</div>
            <div className="text-xs text-muted-foreground">Prediction models</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Intelligence Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Training Data
          </TabsTrigger>
          <TabsTrigger value="error-detection" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Error Detection
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiMetrics?.performance?.slice(0, 5).map((metric) => (
                    <div key={metric.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{metric.metric_name}</div>
                        <div className="text-sm text-muted-foreground">{metric.metric_type}</div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {(metric.metric_value * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Automation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiMetrics?.automation?.slice(0, 5).map((rule) => (
                    <div key={rule.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.rule_type}</div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => executeAutomationMutation.mutate(rule.id)}
                        disabled={executeAutomationMutation.isPending}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Recognition Cache</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiMetrics?.recognition?.map((recognition) => (
                  <div key={recognition.id} className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Recognition #{recognition.id.substring(0, 8)}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Confidence: {Math.round((recognition.confidence_score || 0) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(recognition.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="models">
          <AIPredictionsManager />
        </TabsContent>

        <TabsContent value="training">
          <AITrainingManager />
        </TabsContent>

        <TabsContent value="error-detection">
          <ErrorCoinDetection />
        </TabsContent>

        <TabsContent value="validation">
          <Phase8CompletionValidator />
        </TabsContent>
      </Tabs>

      {/* Phase 8 Status */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Phase 8 AI Implementation Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Advanced Predictive Analytics Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Machine Learning Models Management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>AI Training Data Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Error Coin Detection System</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Real-time AI Performance Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Intelligent Automation Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>AI Recognition Caching System</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Comprehensive AI Analytics Dashboard</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-100 rounded-lg">
            <p className="text-sm text-purple-700">
              <strong>Phase 8 Complete:</strong> AI-Powered Predictive Intelligence system fully operational with 
              advanced machine learning capabilities, real-time AI performance monitoring, intelligent automation, 
              and comprehensive error detection systems integrated with Supabase backend.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase8AIPredictiveIntelligence;