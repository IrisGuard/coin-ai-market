
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Settings, Zap } from 'lucide-react';
import { useExternalPriceSources } from '@/hooks/useEnhancedDataSources';
import EnhancedSourcesManager from '../enhanced/EnhancedSourcesManager';

const AdminExternalSourcesTab = () => {
  const { data: sources = [], isLoading } = useExternalPriceSources();
  const [viewMode, setViewMode] = useState<'enhanced' | 'legacy'>('enhanced');

  return (
    <div className="space-y-6">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">External Sources Management</h3>
          <p className="text-sm text-muted-foreground">
            Advanced global marketplace intelligence system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'enhanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('enhanced')}
          >
            <Zap className="h-4 w-4 mr-2" />
            Enhanced Mode
          </Button>
          <Button
            variant={viewMode === 'legacy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('legacy')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Legacy Mode
          </Button>
        </div>
      </div>

      {/* Enhanced Mode */}
      {viewMode === 'enhanced' && <EnhancedSourcesManager />}

      {/* Legacy Mode - Simplified view */}
      {viewMode === 'legacy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              External Sources ({sources.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading external sources...</div>
            ) : (
              <div className="space-y-4">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{source.source_name}</div>
                      <div className="text-sm text-muted-foreground">{source.base_url}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{source.source_type}</Badge>
                        <Badge variant="outline">
                          {Math.round((source.reliability_score || 0) * 100)}% reliable
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {source.rate_limit_per_hour}/hour limit
                      </div>
                      <Badge variant={source.scraping_enabled ? 'default' : 'secondary'}>
                        {source.scraping_enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminExternalSourcesTab;
