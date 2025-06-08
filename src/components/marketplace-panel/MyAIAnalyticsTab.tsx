
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, BarChart3, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useUserAIAnalytics } from '@/hooks/useUserAIAnalytics';

const MyAIAnalyticsTab = () => {
  const { data: analytics, isLoading, error } = useUserAIAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-electric-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Error loading AI analytics: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const { metrics, analysisLogs, recognitionCache } = analytics || {
    metrics: { totalAnalyses: 0, avgAccuracy: 0, avgProcessingTime: 0, successRate: 0 },
    analysisLogs: [],
    recognitionCache: []
  };

  return (
    <div className="space-y-6">
      {/* AI Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-electric-purple" />
              <div>
                <p className="text-sm text-gray-600">Total AI Analyses</p>
                <p className="text-2xl font-bold">{metrics.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-electric-green" />
              <div>
                <p className="text-sm text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold">{metrics.avgAccuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-electric-blue" />
              <div>
                <p className="text-sm text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold">{metrics.avgProcessingTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-electric-orange" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{metrics.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisLogs.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Analysis Yet</h3>
              <p className="text-gray-600">Upload and analyze your first coin to see AI insights here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Brain className="w-5 h-5 text-electric-purple" />
                    </div>
                    <div>
                      <p className="font-medium">AI Analysis #{log.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {log.analysis_type} • {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(log.accuracy_score * 100)}% accuracy
                    </Badge>
                    <span className="text-sm text-gray-500">{log.analysis_time}s</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recognition Cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Recognition Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recognitionCache.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">No recent AI recognition results.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recognitionCache.slice(0, 3).map((cache) => (
                <div key={cache.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Recognition #{cache.id.slice(0, 8)}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round((cache.confidence_score || 0) * 100)}% confidence
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span>Processing: {cache.processing_time_ms}ms</span>
                    <span>Sources: {cache.sources_consulted?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAIAnalyticsTab;
