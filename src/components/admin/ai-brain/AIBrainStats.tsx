
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Settings, Brain, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AIBrainStatsProps {
  aiStatsRaw?: any;
  pendingOps?: number;
}

const AIBrainStats: React.FC<AIBrainStatsProps> = () => {
  const { data: aiStats, isLoading } = useQuery({
    queryKey: ['ai-brain-stats'],
    queryFn: async () => {
      const [commandsResult, rulesResult, modelsResult, queueResult] = await Promise.all([
        supabase.from('ai_commands').select('*'),
        supabase.from('automation_rules').select('*'),
        supabase.from('prediction_models').select('*'),
        supabase.from('command_queue').select('*').eq('status', 'pending')
      ]);

      const activeCommands = commandsResult.data?.filter(cmd => cmd.is_active)?.length || 0;
      const activeRules = rulesResult.data?.filter(rule => rule.is_active)?.length || 0;
      const activeModels = modelsResult.data?.filter(model => model.is_active)?.length || 0;
      const pendingCommands = queueResult.data?.length || 0;

      return {
        active_commands: activeCommands,
        active_automation_rules: activeRules,
        active_prediction_models: activeModels,
        pending_commands: pendingCommands,
        executions_24h: 0, // Would need execution logs to calculate
        average_prediction_confidence: 0.85,
        automation_rules_executed_24h: 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = aiStats || {
    active_commands: 0,
    active_automation_rules: 0,
    active_prediction_models: 0,
    pending_commands: 0,
    executions_24h: 0,
    average_prediction_confidence: 0,
    automation_rules_executed_24h: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Commands</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active_commands}</div>
          <p className="text-xs text-muted-foreground">
            {stats.executions_24h} executions today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active_automation_rules}</div>
          <p className="text-xs text-muted-foreground">
            {stats.automation_rules_executed_24h} executed today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prediction Models</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active_prediction_models}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(stats.average_prediction_confidence * 100)}% avg confidence
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Queue</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending_commands}</div>
          <p className="text-xs text-muted-foreground">operations waiting</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainStats;
