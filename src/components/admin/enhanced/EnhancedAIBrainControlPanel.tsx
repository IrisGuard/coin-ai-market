
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Settings, TrendingUp, List, BarChart3
} from 'lucide-react';

// Import the refactored components
import AIBrainHeader from './AIBrainHeader';
import AIBrainStatsGrid from './AIBrainStatsGrid';
import AIBrainPerformanceMetrics from './AIBrainPerformanceMetrics';
import AIBrainAnalyticsPlaceholder from './AIBrainAnalyticsPlaceholder';
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

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Live Stats */}
      <Card>
        <AIBrainHeader dashboardStats={dashboardStats} />
        <CardContent>
          {/* AI Modules Overview */}
          <div className="mb-6">
            <AIBrainStatsGrid dashboardStats={dashboardStats} />
          </div>

          {/* Performance Metrics */}
          <AIBrainPerformanceMetrics dashboardStats={dashboardStats} />
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
          <AIBrainAnalyticsPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIBrainControlPanel;
