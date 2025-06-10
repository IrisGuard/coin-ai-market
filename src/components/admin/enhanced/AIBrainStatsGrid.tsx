
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Settings, TrendingUp, Clock } from 'lucide-react';

interface AIBrainStatsGridProps {
  dashboardStats: any;
}

const AIBrainStatsGrid = ({ dashboardStats }: AIBrainStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Active Commands</p>
              <p className="text-2xl font-bold">{dashboardStats?.active_commands || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Automation Rules</p>
              <p className="text-2xl font-bold">{dashboardStats?.active_automation_rules || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Prediction Models</p>
              <p className="text-2xl font-bold">{dashboardStats?.active_prediction_models || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Pending Queue</p>
              <p className="text-2xl font-bold">{dashboardStats?.pending_commands || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainStatsGrid;
