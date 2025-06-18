
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image, CheckCircle, BarChart3, Clock } from 'lucide-react';

interface EnhancementStats {
  total_enhancements: number;
  successful_enhancements: number;
  failed_enhancements: number;
  average_quality_improvement: number;
  average_processing_time: number;
  enhancements_today: number;
}

interface EnhancementStatsCardsProps {
  stats: EnhancementStats | undefined;
}

const EnhancementStatsCards: React.FC<EnhancementStatsCardsProps> = ({ stats }) => {
  const getSuccessRate = () => {
    if (!stats) return 0;
    return Math.round((stats.successful_enhancements / stats.total_enhancements) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enhanced</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.total_enhancements || 0}
              </p>
            </div>
            <Image className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {getSuccessRate()}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quality Improvement</p>
              <p className="text-2xl font-bold text-purple-600">
                +{stats?.average_quality_improvement || 0}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.average_processing_time || 0}ms
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancementStatsCards;
