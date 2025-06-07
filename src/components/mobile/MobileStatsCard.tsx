
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Zap, 
  Upload, 
  Users, 
  WifiOff, 
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useMobileStats } from '@/hooks/useMobileStats';

const MobileStatsCard = () => {
  const { stats } = useMobileStats();

  const formatTime = (milliseconds: number) => {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="w-5 h-5 text-blue-600" />
          Mobile Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* AI Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">AI Speed</span>
                </div>
                <div className="text-xl font-bold text-orange-600">
                  {formatTime(stats.avgAnalysisTime)}
                </div>
                <Progress value={Math.min((2000 - stats.avgAnalysisTime) / 20, 100)} className="h-1 mt-2" />
              </div>

              <div className="bg-white/70 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Accuracy</span>
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatPercentage(stats.aiAccuracy)}
                </div>
                <Progress value={stats.aiAccuracy * 100} className="h-1 mt-2" />
              </div>
            </div>

            {/* Upload Statistics */}
            <div className="bg-white/70 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Today's Activity</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {stats.userUploadsToday} / {stats.dailyUploads}
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Your uploads</span>
                <span>Total uploads</span>
              </div>
            </div>

            {/* Offline Queue */}
            {stats.offlineQueue > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Offline Queue</span>
                </div>
                <div className="text-lg font-bold text-amber-600">
                  {stats.offlineQueue} items pending
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  Will sync when connection is restored
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Updated 30s ago</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Performance improving</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileStatsCard;
