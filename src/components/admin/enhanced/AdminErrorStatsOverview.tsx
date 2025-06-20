
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Brain, DollarSign, BarChart3, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define the interface for our stats
interface ErrorStats {
  totalErrorTypes: number;
  highRarityErrors: number;
  aiDetectionReady: number;
  marketDataPoints: number;
  avgMarketValue: number;
  premiumErrors: number;
  weeklyDetections: number;
  avgConfidence: number;
  errorCategories: string[];
  topValueErrors: any[];
}

const AdminErrorStatsOverview = () => {
  const { data: errorStats, isLoading } = useQuery({
    queryKey: ['admin-error-stats'],
    queryFn: async (): Promise<ErrorStats> => {
      const [knowledgeResult, marketResult, detectionResult] = await Promise.all([
        supabase.from('error_coins_knowledge').select('*'),
        supabase.from('error_coins_market_data').select('*'),
        supabase.from('ai_error_detection_logs').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const knowledge = knowledgeResult.data || [];
      const market = marketResult.data || [];
      const detections = detectionResult.data || [];

      return {
        totalErrorTypes: knowledge.length,
        highRarityErrors: knowledge.filter(k => k.rarity_score >= 8).length,
        aiDetectionReady: knowledge.filter(k => k.ai_detection_markers).length,
        marketDataPoints: market.length,
        avgMarketValue: market.length > 0 ? market.reduce((sum, m) => sum + (m.market_value_avg || 0), 0) / market.length : 0,
        premiumErrors: market.filter(m => (m.premium_percentage || 0) > 50).length,
        weeklyDetections: detections.length,
        avgConfidence: detections.length > 0 ? detections.reduce((sum, d) => {
          const confidences = Object.values(d.confidence_scores || {}) as number[];
          return sum + (confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0);
        }, 0) / detections.length : 0,
        errorCategories: [...new Set(knowledge.map(k => k.error_category))],
        topValueErrors: market.sort((a, b) => (b.market_value_avg || 0) - (a.market_value_avg || 0)).slice(0, 5)
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Provide default values if errorStats is undefined
  const stats: ErrorStats = errorStats || {
    totalErrorTypes: 0,
    highRarityErrors: 0,
    aiDetectionReady: 0,
    marketDataPoints: 0,
    avgMarketValue: 0,
    premiumErrors: 0,
    weeklyDetections: 0,
    avgConfidence: 0,
    errorCategories: [],
    topValueErrors: []
  };

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Types</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalErrorTypes}</div>
            <p className="text-xs text-orange-500">In knowledge base</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Rarity</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highRarityErrors}</div>
            <p className="text-xs text-red-500">Rarity 8+ errors</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Ready</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.aiDetectionReady}</div>
            <p className="text-xs text-purple-500">Detection markers</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Data</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.marketDataPoints}</div>
            <p className="text-xs text-green-500">Price records</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${stats.avgMarketValue?.toFixed(0) || '0'}
            </div>
            <p className="text-xs text-blue-500">Market average</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly AI</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.weeklyDetections}</div>
            <p className="text-xs text-yellow-500">Detections</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Categories Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {stats.errorCategories?.map((category: string) => (
              <Badge key={category} variant="outline" className="px-3 py-1">
                {category.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Value Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Highest Value Error Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topValueErrors?.map((error: any, idx: number) => (
              <div key={error.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Grade: {error.grade}</div>
                  <div className="text-sm text-muted-foreground">
                    Premium: {error.premium_percentage?.toFixed(1) || '0'}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ${error.market_value_avg?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Market Value</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Detection Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Average Detection Confidence</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.weeklyDetections}
              </div>
              <p className="text-sm text-muted-foreground">Detections This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorStatsOverview;
