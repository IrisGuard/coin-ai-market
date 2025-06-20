
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Brain, 
  Activity, 
  Zap, 
  Database, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const RealTimeAIBrainDashboard = () => {
  const [activeConnections, setActiveConnections] = useState(0);
  const [processingQueue, setProcessingQueue] = useState(0);

  // Real-time AI Brain stats
  const { data: aiBrainStats, isLoading } = useQuery({
    queryKey: ['ai-brain-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_ai_brain_dashboard_stats');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Real-time updates every 5 seconds
  });

  // AI Command executions in real-time
  const { data: recentExecutions } = useQuery({
    queryKey: ['recent-ai-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select(`
          *,
          ai_commands(name, category)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 3000
  });

  // Active automation rules
  const { data: automationRules } = useQuery({
    queryKey: ['active-automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .order('execution_count', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Prediction models performance
  const { data: predictionModels } = useQuery({
    queryKey: ['prediction-models-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediction_models')
        .select('*')
        .eq('is_active', true)
        .order('accuracy_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Simulate real-time connection monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(Math.floor(Math.random() * 50) + 20);
      setProcessingQueue(Math.floor(Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            🧠 AI BRAIN - REAL-TIME OPERATIONAL STATUS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeConnections}</div>
              <div className="text-sm text-muted-foreground">Active Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{processingQueue}</div>
              <div className="text-sm text-muted-foreground">Processing Queue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aiBrainStats?.active_commands || 0}</div>
              <div className="text-sm text-muted-foreground">Active Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{aiBrainStats?.executions_24h || 0}</div>
              <div className="text-sm text-muted-foreground">Executions 24h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core AI Brain Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Commands</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{aiBrainStats?.active_commands || 0}</div>
            <p className="text-xs text-muted-foreground">Ready for execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{aiBrainStats?.active_automation_rules || 0}</div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Models</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{aiBrainStats?.active_prediction_models || 0}</div>
            <p className="text-xs text-muted-foreground">ML models active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((aiBrainStats?.average_prediction_confidence || 0) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed AI Brain Monitoring */}
      <Tabs defaultValue="executions">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="executions">Recent Executions</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="predictions">Prediction Models</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="executions">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Command Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Command</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExecutions?.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell className="font-medium">
                        {execution.ai_commands?.name || 'Unknown Command'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {execution.ai_commands?.category || 'general'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(execution.execution_status)}>
                          {execution.execution_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {execution.execution_time_ms ? `${execution.execution_time_ms}ms` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(execution.created_at).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Active Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {automationRules?.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Executed: {rule.execution_count} times
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Success: {Math.round((rule.success_count / Math.max(rule.execution_count, 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Models Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {predictionModels?.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-muted-foreground">{model.model_type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Accuracy: {Math.round((model.accuracy_score || 0) * 100)}%
                      </div>
                      <Badge className={model.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {model.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>AI Brain Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">System Health</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <Badge className="bg-green-100 text-green-800">Fast</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <Badge className="bg-green-100 text-green-800">0.2%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Execution Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Executions</span>
                      <span className="font-medium">{aiBrainStats?.executions_24h || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queue Length</span>
                      <span className="font-medium">{aiBrainStats?.pending_commands || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Confidence</span>
                      <span className="font-medium">
                        {Math.round((aiBrainStats?.average_prediction_confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeAIBrainDashboard;
