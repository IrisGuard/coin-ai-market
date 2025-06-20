import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, TrendingUp, Eye, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ConnectedAIAnalysis = () => {
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  // Real connection to AI commands from Admin system
  const { data: aiCommands, isLoading: commandsLoading } = useQuery({
    queryKey: ['admin-ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .in('category', ['coin_identification', 'market_analysis', 'authentication'])
        .order('priority', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI commands for admin:', error);
        throw error;
      }
      
      console.log('✅ Admin AI commands loaded:', data?.length);
      return data || [];
    }
  });

  const executeAICommand = async (commandId: string) => {
    setActiveCommand(commandId);
    try {
      const { data, error } = await supabase.rpc('execute_ai_command', {
        p_command_id: commandId,
        p_input_data: {}
      });

      if (error) throw error;
      console.log('✅ AI Command executed:', data);
    } catch (error) {
      console.error('❌ Error executing AI command:', error);
    } finally {
      setActiveCommand(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coin_identification': return 'bg-blue-100 text-blue-800';
      case 'market_analysis': return 'bg-green-100 text-green-800';
      case 'authentication': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Real connection to AI performance data
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['admin-ai-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('❌ Error fetching AI performance for admin:', error);
        throw error;
      }
      
      console.log('✅ Admin AI performance loaded:', data?.length);
      return data || [];
    }
  });

  // Real connection to recent analysis results
  const { data: analysisResults, isLoading: analysisLoading } = useQuery({
    queryKey: ['admin-analysis-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dual_image_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('❌ Error fetching analysis results for admin:', error);
        throw error;
      }
      
      console.log('✅ Admin analysis results loaded:', data?.length);
      return data || [];
    }
  });

  if (commandsLoading || performanceLoading || analysisLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Commands Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Admin AI Analysis Commands
            <Badge className="bg-blue-100 text-blue-800">Full Admin Access</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiCommands?.map((command) => (
              <Card key={command.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{command.name}</h3>
                    <Badge className={getCategoryColor(command.category)}>
                      {command.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {command.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Priority: {command.priority}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => executeAICommand(command.id)}
                      disabled={activeCommand === command.id}
                    >
                      {activeCommand === command.id ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              AI Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData?.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{metric.metric_name}</div>
                    <div className="text-sm text-muted-foreground">{metric.metric_type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-bold">
                      {typeof metric.metric_value === 'number' ? 
                        metric.metric_value.toFixed(2) : metric.metric_value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              Recent Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResults?.map((result) => (
                <div key={result.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Analysis #{result.id.substring(0, 8)}
                    </div>
                    <Badge variant="outline">
                      {Math.round((result.confidence_score || 0) * 100)}% confidence
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Grade: {result.grade_assessment || 'Not assessed'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Errors: {result.detected_errors?.length || 0} detected
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(result.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>AI System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aiCommands?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Available Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{performanceData?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Performance Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysisResults?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Recent Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((analysisResults?.reduce((sum, r) => sum + (r.confidence_score || 0), 0) || 0) / (analysisResults?.length || 1) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedAIAnalysis;
