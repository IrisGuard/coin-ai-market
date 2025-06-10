
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Brain, Zap, Settings, Play, Pause, Plus, Search, Activity } from 'lucide-react';

interface AIStatsData {
  ai_automation?: {
    commands: number;
    rules: number;
    models: number;
    executions_24h: number;
    avg_confidence: number;
  };
  operations?: {
    pending_bulk_operations: number;
  };
}

const AdminAIBrainTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Get AI Brain dashboard stats
  const { data: aiStatsRaw, isLoading: statsLoading } = useQuery({
    queryKey: ['comprehensive-ai-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_comprehensive_dashboard_stats');
      if (error) throw error;
      return data as AIStatsData;
    },
    refetchInterval: 30000,
  });

  // Get AI Commands
  const { data: aiCommands, isLoading: commandsLoading } = useQuery({
    queryKey: ['ai-commands', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Get Automation Rules
  const { data: automationRules, isLoading: rulesLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

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

  // Execute AI Command
  const executeCommand = useMutation({
    mutationFn: async (commandId: string) => {
      const { data, error } = await supabase.rpc('execute_automation_rule', {
        rule_id: commandId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Command Executed",
        description: "AI command has been executed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['comprehensive-ai-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle Automation Rule
  const toggleRule = useMutation({
    mutationFn: async ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      toast({
        title: "Rule Updated",
        description: "Automation rule status has been updated.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Brain Control Center</h3>
          <p className="text-sm text-muted-foreground">Manage AI commands, automation rules, and prediction models</p>
        </div>
      </div>

      {/* AI Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Commands</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStatsRaw?.ai_automation?.commands || 0}</div>
            <p className="text-xs text-muted-foreground">
              {aiStatsRaw?.ai_automation?.executions_24h || 0} executions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStatsRaw?.ai_automation?.rules || 0}</div>
            <p className="text-xs text-muted-foreground">active automation rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStatsRaw?.ai_automation?.models || 0}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((aiStatsRaw?.ai_automation?.avg_confidence || 0) * 100)}% avg confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Queue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStatsRaw?.operations?.pending_bulk_operations || 0}</div>
            <p className="text-xs text-muted-foreground">operations waiting</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Commands Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Commands</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commandsLoading ? (
              <div className="text-center py-8">Loading AI commands...</div>
            ) : aiCommands?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No AI commands found
              </div>
            ) : (
              aiCommands?.map((command) => (
                <div key={command.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{command.name}</div>
                    <div className="text-sm text-muted-foreground">{command.description}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={command.is_active ? "default" : "secondary"}>
                        {command.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{command.command_type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => executeCommand.mutate(command.id)}
                      disabled={!command.is_active || executeCommand.isPending}
                    >
                      <Play className="h-4 w-4" />
                      Execute
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rulesLoading ? (
              <div className="text-center py-8">Loading automation rules...</div>
            ) : automationRules?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No automation rules found
              </div>
            ) : (
              automationRules?.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-muted-foreground">{rule.description}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{rule.rule_type}</Badge>
                      <Badge variant="outline">Executed: {rule.execution_count || 0}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRule.mutate({ ruleId: rule.id, isActive: rule.is_active })}
                      disabled={toggleRule.isPending}
                    >
                      {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {rule.is_active ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default AdminAIBrainTab;
