
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, TrendingUp } from 'lucide-react';
import { calculateSourceStats } from './utils';

interface SourcesHeaderProps {
  sources: any[] | undefined;
}

const SourcesHeader = ({ sources }: SourcesHeaderProps) => {
  const { activeSources, avgReliability } = calculateSourceStats(sources);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Production Sources Management</h2>
        <p className="text-muted-foreground">
          Live data integration with {sources?.length || 0} verified sources
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Shield className="h-4 w-4 mr-1" />
          Production Ready
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Activity className="h-4 w-4 mr-1" />
          {activeSources} Active
        </Badge>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          <TrendingUp className="h-4 w-4 mr-1" />
          {avgReliability.toFixed(1)}% Reliable
        </Badge>
      </div>
    </div>
  );
};

export default SourcesHeader;
