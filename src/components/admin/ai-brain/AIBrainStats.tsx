
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AIBrainStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['ai-brain-stats'],
    queryFn: async () => {
      // Get AI Commands stats
      const { data: commands } = await supabase
        .from('ai_commands')
        .select('*');
      
      // Get Automation Rules stats
      const { data: rules } = await supabase
        .from('automation_rules')
        .select('*');
      
      // Get Prediction Models stats
      const { data: models } = await supabase
        .from('prediction_models')
        .select('*');
      
      // Get recent executions
      const { data: executions } = await supabase
        .from('ai_command_executions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      return {
        commands: commands || [],
        rules: rules || [],
        models: models || [],
        executions: executions || []
      };
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeCommands = stats?.commands?.filter(c => c.is_active).length || 0;
  const totalCommands = stats?.commands?.length || 0;
  const activeRules = stats?.rules?.filter(r => r.is_active).length || 0;
  const totalRules = stats?.rules?.length || 0;
  const activeModels = stats?.models?.filter(m => m.is_active).length || 0;
  const totalModels = stats?.models?.length || 0;
  const executions24h = stats?.executions?.length || 0;

  const commandsHealth = totalCommands > 0 ? (activeCommands / totalCommands) * 100 : 0;
  const rulesHealth = totalRules > 0 ? (activeRules / totalRules) * 100 : 0;
  const modelsHealth = totalModels > 0 ? (activeModels / totalModels) * 100 : 0;

  const overallHealth = totalCommands + totalRules + totalModels > 0 
    ? ((activeCommands + activeRules + activeModels) / (totalCommands + totalRules + totalModels)) * 100 
    : 0;

  const getHealthIcon = (health: number) => {
    if (health >= 80) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (health >= 50) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Brain Status</h3>
              <div className="flex items-center gap-2">
                {getHealthIcon(overallHealth)}
                <span className="text-sm">
                  {overallHealth >= 80 ? 'Excellent' : overallHealth >= 50 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(overallHealth)}%</div>
              <div className="text-sm opacity-90">Overall Health</div>
            </div>
          </div>
          <Progress value={overallHealth} className="mt-4 bg-white/20" />
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Commands</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{activeCommands}</p>
                  <span className="text-sm text-muted-foreground">/ {totalCommands}</span>
                  {getHealthIcon(commandsHealth)}
                </div>
                <div className={`text-xs mt-1 ${getHealthColor(commandsHealth)}`}>
                  {Math.round(commandsHealth)}% Active
                </div>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Automation Rules</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{activeRules}</p>
                  <span className="text-sm text-muted-foreground">/ {totalRules}</span>
                  {getHealthIcon(rulesHealth)}
                </div>
                <div className={`text-xs mt-1 ${getHealthColor(rulesHealth)}`}>
                  {Math.round(rulesHealth)}% Active
                </div>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prediction Models</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold">{activeModels}</p>
                  <span className="text-sm text-muted-foreground">/ {totalModels}</span>
                  {getHealthIcon(modelsHealth)}
                </div>
                <div className={`text-xs mt-1 ${getHealthColor(modelsHealth)}`}>
                  {Math.round(modelsHealth)}% Active
                </div>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Executions (24h)</p>
                <p className="text-2xl font-bold mt-1">{executions24h}</p>
                <Badge variant={executions24h > 0 ? "default" : "secondary"} className="text-xs mt-1">
                  {executions24h > 0 ? "Active" : "Idle"}
                </Badge>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Brain Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex justify-between items-center text-sm">
              <span>Commands Health:</span>
              <div className="flex items-center gap-2">
                <Progress value={commandsHealth} className="w-20 h-2" />
                <span className={getHealthColor(commandsHealth)}>{Math.round(commandsHealth)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Automation Health:</span>
              <div className="flex items-center gap-2">
                <Progress value={rulesHealth} className="w-20 h-2" />
                <span className={getHealthColor(rulesHealth)}>{Math.round(rulesHealth)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Models Health:</span>
              <div className="flex items-center gap-2">
                <Progress value={modelsHealth} className="w-20 h-2" />
                <span className={getHealthColor(modelsHealth)}>{Math.round(modelsHealth)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainStats;
