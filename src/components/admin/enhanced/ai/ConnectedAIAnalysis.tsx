
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
              <div key={command.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getCategoryColor(command.category)}>
                    {command.category}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => executeAICommand(command.id)}
                    disabled={activeCommand === command.id}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {activeCommand === command.id ? (
                      <div className="animate-spin h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <h3 className="font-medium text-sm mb-2">{command.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{command.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">Priority: {command.priority}</Badge>
                  <Badge variant="outline">{command.command_type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Live AI Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{aiCommands?.length || 0}</div>
              <div className="text-sm text-gray-600">Active Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{performanceData?.length || 0}</div>
              <div className="text-sm text-gray-600">Recent Executions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysisResults?.length || 0}</div>
              <div className="text-sm text-gray-600">Analysis Results</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Analysis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-purple-600" />
            Recent Live Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysisResults && analysisResults.length > 0 ? (
              analysisResults.map((result, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      Analysis ID: {result.id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {((result.confidence_score || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>AI Brain is processing live data</p>
                <p className="text-sm">Analysis results will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedAIAnalysis;
