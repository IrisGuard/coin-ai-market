
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Settings, Brain, Activity } from 'lucide-react';

interface AIStatsData {
  active_commands: number;
  active_automation_rules: number;
  active_prediction_models: number;
  pending_commands: number;
  executions_24h: number;
  average_prediction_confidence: number;
  automation_rules_executed_24h: number;
}

interface AIBrainStatsProps {
  aiStatsRaw: AIStatsData | undefined;
  pendingOps: number | undefined;
}

const AIBrainStats: React.FC<AIBrainStatsProps> = ({ aiStatsRaw, pendingOps }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Commands</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiStatsRaw?.active_commands || 0}</div>
          <p className="text-xs text-muted-foreground">
            {aiStatsRaw?.executions_24h || 0} executions today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Automation Rules</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiStatsRaw?.active_automation_rules || 0}</div>
          <p className="text-xs text-muted-foreground">active automation rules</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prediction Models</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{aiStatsRaw?.active_prediction_models || 0}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((aiStatsRaw?.average_prediction_confidence || 0) * 100)}% avg confidence
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Queue</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOps || 0}</div>
          <p className="text-xs text-muted-foreground">operations waiting</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainStats;
