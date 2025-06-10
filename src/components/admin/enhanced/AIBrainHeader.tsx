
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Zap } from 'lucide-react';

interface AIBrainHeaderProps {
  dashboardStats: any;
}

const AIBrainHeader = ({ dashboardStats }: AIBrainHeaderProps) => {
  const isSystemHealthy = (dashboardStats?.active_commands || 0) > 0;

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">GlobalCoinsAI Brain Control Panel</CardTitle>
            <p className="text-gray-600">Advanced AI system management and monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <Badge variant={isSystemHealthy ? 'default' : 'destructive'}>
              {isSystemHealthy ? 'AI Systems Online' : 'Systems Offline'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <Badge variant="outline">
              {dashboardStats?.executions_24h || 0} executions today
            </Badge>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default AIBrainHeader;
