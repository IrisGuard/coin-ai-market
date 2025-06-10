
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

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

interface AIBrainHeaderProps {
  dashboardStats: DashboardStats;
}

const AIBrainHeader = ({ dashboardStats }: AIBrainHeaderProps) => {
  return (
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
  );
};

export default AIBrainHeader;
