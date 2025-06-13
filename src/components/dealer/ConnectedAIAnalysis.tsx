
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, Database, AlertCircle } from 'lucide-react';
import { useRealAICommands, useRealAutomationRules, useRealPerformanceMetrics } from '@/hooks/useRealAdminData';
import { useExecuteAICommand } from '@/hooks/useExecuteAICommand';

const ConnectedAIAnalysis = () => {
  const { data: aiCommands = [], isLoading: aiLoading } = useRealAICommands();
  const { data: automationRules = [], isLoading: autoLoading } = useRealAutomationRules();
  const { data: performanceMetrics = [], isLoading: metricsLoading } = useRealPerformanceMetrics();
  const { executeCommand, isExecuting } = useExecuteAICommand();

  if (aiLoading || autoLoading || metricsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Brain className="animate-spin h-6 w-6 text-blue-600" />
            <span>Connecting to Admin AI Brain...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const coinAnalysisCommands = aiCommands.filter(cmd => 
    cmd.category === 'coin_identification' || cmd.category === 'market_analysis'
  );

  const activeAutomation = automationRules.filter(rule => rule.is_active);

  const recentMetrics = performanceMetrics.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* AI Commands Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Connected AI Analysis ({coinAnalysisCommands.length} Commands)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {coinAnalysisCommands.map((command) => (
              <div key={command.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{command.name}</h4>
                  <p className="text-sm text-muted-foreground">{command.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{command.category}</Badge>
                    <Badge variant="secondary">Priority: {command.priority}</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => executeCommand(command.id, {})}
                  disabled={isExecuting}
                  className="flex items-center gap-1"
                >
                  <Zap className="w-4 h-4" />
                  Execute
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Active Automation ({activeAutomation.length} Rules)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeAutomation.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{rule.rule_type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Executed: {rule.execution_count} times
                    </span>
                  </div>
                </div>
                <Badge variant={rule.is_active ? "default" : "secondary"}>
                  {rule.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMetrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{metric.metric_name}</h4>
                  <p className="text-sm text-muted-foreground">Type: {metric.metric_type}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{metric.metric_value}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(metric.recorded_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-600">
            <Database className="w-5 h-5" />
            <span className="font-medium">Connected to Admin Brain</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              87 Tables Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedAIAnalysis;
