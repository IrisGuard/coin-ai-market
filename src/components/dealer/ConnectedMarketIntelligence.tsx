
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Database, DollarSign, AlertCircle } from 'lucide-react';
import { useRealExternalSources, useRealMarketAnalytics } from '@/hooks/useRealAdminData';

const ConnectedMarketIntelligence = () => {
  const { data: externalSources = [], isLoading: sourcesLoading } = useRealExternalSources();
  const { data: marketAnalytics = [], isLoading: analyticsLoading } = useRealMarketAnalytics();

  if (sourcesLoading || analyticsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Globe className="animate-spin h-6 w-6 text-blue-600" />
            <span>Connecting to Market Intelligence Systems...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeSources = externalSources.filter(source => source.is_active);
  const recentAnalytics = marketAnalytics.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* External Price Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Connected Price Sources ({activeSources.length} Active)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {activeSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{source.source_name}</h4>
                  <p className="text-sm text-muted-foreground">{source.base_url}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{source.source_type}</Badge>
                    <Badge variant="secondary">Priority: {source.priority_score}</Badge>
                    {source.specializes_in_errors && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Error Specialist
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Reliability: {Math.round((source.reliability_score || 0) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rate: {source.rate_limit_per_hour}/hour
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Real Market Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAnalytics.map((analytic) => (
              <div key={analytic.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{analytic.metric_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Type: {analytic.metric_type} | Period: {analytic.time_period}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {analytic.metric_value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(analytic.recorded_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-600">
            <Database className="w-5 h-5" />
            <span className="font-medium">Market Intelligence Active</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {activeSources.length} Sources Connected
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedMarketIntelligence;
