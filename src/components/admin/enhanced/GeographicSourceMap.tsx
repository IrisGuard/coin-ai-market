
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
}

interface GeographicSourceMapProps {
  sources: Source[];
}

const GeographicSourceMap: React.FC<GeographicSourceMapProps> = ({ sources }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Source Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Interactive world map with {sources.length} sources coming soon.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {sources.map(source => (
              <div key={source.id} className="mb-1">
                {source.name} - {source.type}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicSourceMap;
