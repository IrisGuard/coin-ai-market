
import React from 'react';
import { Brain, Settings, TrendingUp, List } from 'lucide-react';

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

interface AIBrainStatsGridProps {
  dashboardStats: DashboardStats;
}

const AIBrainStatsGrid = ({ dashboardStats }: AIBrainStatsGridProps) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
};

export default AIBrainStatsGrid;
