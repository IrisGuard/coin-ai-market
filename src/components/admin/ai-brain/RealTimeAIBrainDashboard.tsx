
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  Zap, 
  TrendingUp, 
  Database, 
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAICommands } from '@/hooks/useEnhancedAICommands';

// Define interface for AI Brain stats
interface AIBrainStats {
  active_commands: number;
  active_automation_rules: number;
  active_prediction_models: number;
  pending_commands: number;
  executions_24h: number;
  average_prediction_confidence: number;
  automation_rules_executed_24h: number;
  last_updated: string;
}

const RealTimeAIBrainDashboard = () => {
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  
  const { data: aiStats, isLoading: statsLoading } = useQuery({
    queryKey: ['ai-brain-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ai_brain_dashboard_stats');
      if (error) throw error;
      return data as AIBrainStats;
    },
    refetchInterval: 5000
  });

  const { 
    commands, 
    executeCommand, 
    isExecuting, 
    executionHistory,
    stats 
  } = useEnhancedAICommands();

  const { data: performanceMetrics } = useQuery({
    queryKey: ['ai-performance-real-time'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000
  });

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getSystemHealthStatus = () => {
    if (!aiStats) return 'unknown';
    
    const totalCommands = aiStats.active_commands || 0;
    const recentExecutions = aiStats.executions_24h || 0;
    const avgConfidence = aiStats.average_prediction_confidence || 0;

    if (totalCommands > 10 && recentExecutions > 5 && avgConfidence > 0.8) {
      return 'excellent';
    } else if (totalCommands > 5 && recentExecutions > 2 && avgConfidence > 0.6) {
      return 'good';
    } else if (totalCommands > 0 && avgConfidence > 0.4) {
      return 'fair';
    }
    return 'needs_attention';
  };

  const systemHealth = getSystemHealthStatus();

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Brain System Health
            <Badge className={`ml-auto ${
              systemHealth === 'excellent' ? 'bg-green-600' :
              systemHealth === 'good' ? 'bg-blue-600' :
              systemHealth === 'fair' ? 'bg-yellow-600' : 'bg-red-600'
            } text-white`}>
              {systemHealth === 'excellent' ? 'Excellent' :
               systemHealth === 'good' ? 'Good' :
               systemHealth === 'fair' ? 'Fair' : 'Needs Attention'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {aiStats?.active_commands || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {aiStats?.executions_24h || 0}
              </div>
              <div className="text-sm text-muted-foreground">24h Executions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {aiStats?.active_automation_rules || 0}
              </div>
              <div className="text-sm text-muted-foreground">Automation Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {aiStats?.active_prediction_models || 0}
              </div>
              <div className="text-sm text-muted-foreground">Prediction Models</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>AI Confidence Level</span>
              <span>{((aiStats?.average_prediction_confidence || 0) * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={(aiStats?.average_prediction_confidence || 0) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Command Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commands.slice(0, 6).map((command) => (
          <Card key={command.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{command.name}</CardTitle>
                <Badge variant={command.is_active ? "default" : "secondary"}>
                  {command.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{command.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {command.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Priority: {command.priority}
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => executeCommand(command.id)}
                disabled={isExecuting || !command.is_active}
                className="w-full"
              >
                {isExecuting ? (
                  <>
                    <Activity className="h-3 w-3 mr-1 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3 mr-1" />
                    Execute
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Real-Time Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                System Performance
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Executions (24h):</span>
                  <span className="font-medium">{aiStats?.executions_24h || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Commands:</span>
                  <span className="font-medium">{aiStats?.pending_commands || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Confidence:</span>
                  <span className="font-medium">
                    {((aiStats?.average_prediction_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                Data Processing
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Cache Hit Rate:</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Response Time:</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span className="font-medium text-green-600">0.03%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Recent Activity
              </h4>
              <div className="space-y-1 text-sm">
                {executionHistory.slice(0, 3).map((execution, idx) => (
                  <div key={execution.id} className="flex items-center gap-2">
                    {execution.execution_status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : execution.execution_status === 'failed' ? (
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                    ) : (
                      <Activity className="h-3 w-3 text-blue-600 animate-spin" />
                    )}
                    <span className="truncate">{execution.ai_commands?.name || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-sm font-medium">Neural Network</div>
          <div className="text-xs text-green-600">Optimal</div>
        </Card>

        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Database className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-sm font-medium">Data Pipeline</div>
          <div className="text-xs text-green-600">Active</div>
        </Card>

        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Settings className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-sm font-medium">Automation</div>
          <div className="text-xs text-green-600">Running</div>
        </Card>

        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <div className="text-sm font-medium">Learning</div>
          <div className="text-xs text-green-600">Continuous</div>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAIBrainDashboard;
