
import React from 'react';
import { Zap, BarChart3, CheckCircle } from 'lucide-react';

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

interface AIBrainPerformanceMetricsProps {
  dashboardStats: DashboardStats;
}

const AIBrainPerformanceMetrics = ({ dashboardStats }: AIBrainPerformanceMetricsProps) => {
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
  );
};

export default AIBrainPerformanceMetrics;
