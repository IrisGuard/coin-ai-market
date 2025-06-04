
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Activity, Target, Clock } from 'lucide-react';
import { useSourcePerformanceMetrics } from '@/hooks/useEnhancedAdminSources';

const PerformanceAnalytics = () => {
  const { data: metrics } = useSourcePerformanceMetrics();

  const mockMetrics = [
    {
      source_name: "Heritage Auctions",
      successful_requests: 2847,
      failed_requests: 23,
      avg_response_time: 1200,
      data_quality_score: 0.97,
      coins_discovered: 456,
      success_rate: 99.2
    },
    {
      source_name: "eBay Coins",
      successful_requests: 4521,
      failed_requests: 187,
      avg_response_time: 3400,
      data_quality_score: 0.84,
      coins_discovered: 1203,
      success_rate: 96.0
    },
    {
      source_name: "PCGS CoinFacts",
      successful_requests: 1876,
      failed_requests: 5,
      avg_response_time: 890,
      data_quality_score: 0.99,
      coins_discovered: 234,
      success_rate: 99.7
    }
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 0.95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 0.85) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    if (score >= 0.70) return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8K</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">97.8%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.3% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8s</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -0.2s faster
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <p className="text-xs text-muted-foreground">
              Average quality score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Source Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{metric.source_name}</h4>
                  <div className="flex items-center gap-2">
                    {getQualityBadge(metric.data_quality_score)}
                    <Badge variant="outline" className={getPerformanceColor(metric.success_rate)}>
                      {metric.success_rate}% success
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Requests</div>
                    <div className="font-medium">
                      {metric.successful_requests.toLocaleString()} / {(metric.successful_requests + metric.failed_requests).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg Response</div>
                    <div className="font-medium">{metric.avg_response_time}ms</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Coins Found</div>
                    <div className="font-medium">{metric.coins_discovered}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Quality Score</div>
                    <div className="font-medium">{(metric.data_quality_score * 100).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Success Rate</span>
                    <span>{metric.success_rate}%</span>
                  </div>
                  <Progress value={metric.success_rate} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
