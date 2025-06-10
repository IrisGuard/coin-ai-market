
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Settings, TrendingUp, List, BarChart3,
  Zap, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

// Import the new enhanced components
import AutomationRulesManager from './AutomationRulesManager';
import PredictiveAnalyticsDashboard from './PredictiveAnalyticsDashboard';
import CommandQueueMonitor from './CommandQueueMonitor';
import AIBrainControlPanel from './AIBrainControlPanel';

// Import the enhanced hooks
import { useAIBrainDashboardStats } from '@/hooks/admin/useEnhancedAIBrain';

// Define interface for dashboard stats
interface DashboardStats {
  active_commands?: number;
  active_automation_rules?: number;
  active_prediction_models?: number;
  pending_commands?: number;
  executions_24h?: number;
  average_prediction_confidence?: number;
  automation_rules_executed_24h?: number;
  last_updated?: string;
}

const EnhancedAIBrainControlPanel = () => {
  const { data: rawDashboardStats, isLoading } = useAIBrainDashboardStats();
  const dashboardStats = rawDashboardStats as DashboardStats;

  const aiModules = [
    {
      id: 'commands',
      title: 'AI Commands',
      value: dashboardStats?.active_commands || 0,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'automation',
      title: 'Automation Rules',
      value: dashboardStats?.active_automation_rules || 0,
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'predictions',
      title: 'Prediction Models',
      value: dashboardStats?.active_prediction_models || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'queue',
      title: 'Pending Commands',
      value: dashboardStats?.pending_commands || 0,
      icon: List,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const performanceMetrics = [
    {
      title: 'Executions (24h)',
      value: dashboardStats?.executions_24h || 0,
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Confidence',
      value: `${((dashboardStats?.average_prediction_confidence || 0) * 100).toFixed(1)}%`,
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      title: 'Rules Executed (24h)',
      value: dashboardStats?.automation_rules_executed_24h || 0,
      icon: CheckCircle,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Live Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Brain className="w-7 h-7 text-purple-600" />
                Enhanced AI Brain Control Center
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Advanced AI command execution, automation, and predictive analytics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live System
              </Badge>
              {dashboardStats?.last_updated && (
                <span className="text-xs text-gray-500">
                  Updated: {new Date(dashboardStats.last_updated).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* AI Modules Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {aiModules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.id} className={`p-4 rounded-lg ${module.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {module.value}
                      </div>
                      <div className="text-sm text-gray-600">{module.title}</div>
                    </div>
                    <Icon className={`w-8 h-8 ${module.color}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                  <div>
                    <div className="font-semibold">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced AI Brain Tabs */}
      <Tabs defaultValue="commands" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Commands
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Queue
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commands">
          <AIBrainControlPanel />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationRulesManager />
        </TabsContent>

        <TabsContent value="predictions">
          <PredictiveAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="queue">
          <CommandQueueMonitor />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Detailed AI performance analytics, command success rates, 
                  prediction accuracy trends, and automation efficiency metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIBrainControlPanel;
