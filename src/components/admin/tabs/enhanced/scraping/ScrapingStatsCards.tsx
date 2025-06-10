
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  Play, 
  TrendingUp, 
  Clock,
  Database,
  RefreshCw
} from 'lucide-react';
import { ScrapingStats } from './types';

interface ScrapingStatsCardsProps {
  stats: ScrapingStats;
}

const ScrapingStatsCards: React.FC<ScrapingStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Total Jobs</p>
              <p className="text-xl font-bold">{stats.totalJobs}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Active</p>
              <p className="text-xl font-bold">{stats.activeJobs}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Success Rate</p>
              <p className="text-xl font-bold">{stats.successRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-xs text-gray-600">Avg Duration</p>
              <p className="text-xl font-bold">{stats.avgDuration}m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-600" />
            <div>
              <p className="text-xs text-gray-600">Data Collected</p>
              <p className="text-xl font-bold">{stats.dataCollected.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-600">Last Run</p>
              <p className="text-xs font-medium">{stats.lastRun}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingStatsCards;
