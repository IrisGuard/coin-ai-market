import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Activity } from 'lucide-react';

interface GeographicSourceMapProps {
  sources: unknown[] | undefined;
}

const GeographicSourceMap: React.FC<GeographicSourceMapProps> = ({ sources = [] }) => {
  const sourcesByRegion = sources?.reduce((acc: Record<string, unknown[]>, source: unknown) => {
    const region = (source as { region?: string }).region || 'Unknown';
    if (!acc[region]) acc[region] = [];
    acc[region].push(source);
    return acc;
  }, {}) || {};

  const regions = Object.keys(sourcesByRegion);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region) => (
              <Card key={region} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{region}</h3>
                    <Badge variant="secondary">
                      {sourcesByRegion[region].length} sources
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sourcesByRegion[region].slice(0, 3).map((source: unknown, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">
                          {(source as { name?: string }).name || 'Unknown Source'}
                        </span>
                        <Activity className="h-3 w-3 text-green-500 ml-auto" />
                      </div>
                    ))}
                    {sourcesByRegion[region].length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{sourcesByRegion[region].length - 3} more sources
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {regions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No geographic data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicSourceMap;
