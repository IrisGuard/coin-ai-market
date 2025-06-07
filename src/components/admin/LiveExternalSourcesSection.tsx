
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExternalSourcesData } from '@/hooks/useRealAdminData';
import { Database, Activity, Settings, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const LiveExternalSourcesSection = () => {
  const { data: sources = [], isLoading, refetch } = useExternalSourcesData();

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading external sources...</p>
        </CardContent>
      </Card>
    );
  }

  const activeCount = sources.filter(s => s.is_active).length;
  const avgReliability = sources.length > 0 
    ? sources.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / sources.length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              External Data Sources
            </CardTitle>
            <CardDescription>
              {activeCount} active sources • Avg reliability: {(avgReliability * 100).toFixed(1)}%
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No external sources configured. Database appears to be empty.
            </div>
          ) : (
            sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{source.source_name}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {source.source_type?.replace('_', ' ')} • {source.base_url}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-xs font-medium ${getReliabilityColor(source.reliability_score || 0)}`}>
                        Reliability: {((source.reliability_score || 0) * 100).toFixed(1)}%
                      </span>
                      {source.scraping_enabled && (
                        <span className="text-xs text-blue-600">
                          <Activity className="w-3 h-3 inline mr-1" />
                          Scraping Enabled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(source.is_active || false)}>
                    {source.is_active ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {source.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveExternalSourcesSection;
