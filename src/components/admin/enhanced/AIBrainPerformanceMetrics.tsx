
import React from 'react';

interface AIBrainPerformanceMetricsProps {
  dashboardStats: any;
}

const AIBrainPerformanceMetrics = ({ dashboardStats }: AIBrainPerformanceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">
          {dashboardStats?.executions_24h || 0}
        </div>
        <div className="text-sm text-gray-600">Executions (24h)</div>
      </div>

      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">
          {((dashboardStats?.average_prediction_confidence || 0) * 100).toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">Avg Confidence</div>
      </div>

      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">
          {dashboardStats?.automation_rules_executed_24h || 0}
        </div>
        <div className="text-sm text-gray-600">Rules Executed (24h)</div>
      </div>
    </div>
  );
};

export default AIBrainPerformanceMetrics;
