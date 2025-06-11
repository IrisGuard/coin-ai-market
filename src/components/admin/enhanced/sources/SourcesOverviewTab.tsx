
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Shield, Activity } from 'lucide-react';
import { calculateSourceStats, getSourceTypeBreakdown } from './utils';

interface SourcesOverviewTabProps {
  sources: any[] | undefined;
}

const SourcesOverviewTab = ({ sources }: SourcesOverviewTabProps) => {
  const { activeSources, avgReliability } = calculateSourceStats(sources);
  const sourceBreakdown = getSourceTypeBreakdown(sources);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Production Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sources?.length || 0}</div>
          <p className="text-sm text-muted-foreground">Verified data sources</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Auction Houses</span>
              <span>{sourceBreakdown.auction_house}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Grading Services</span>
              <span>{sourceBreakdown.grading_service}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Price Guides</span>
              <span>{sourceBreakdown.price_guide}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            System Reliability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{avgReliability.toFixed(1)}%</div>
          <p className="text-sm text-muted-foreground">Average reliability score</p>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>High Reliability (95%+)</span>
              <Badge variant="outline" className="text-green-600">
                {sources?.filter(s => (s.reliability_score || 0) >= 0.95).length || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Good Reliability (90%+)</span>
              <Badge variant="outline" className="text-blue-600">
                {sources?.filter(s => (s.reliability_score || 0) >= 0.90 && (s.reliability_score || 0) < 0.95).length || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Active Sources</span>
              <Badge variant="outline" className="text-purple-600">{activeSources}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Live Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">Real-time</div>
          <p className="text-sm text-muted-foreground">Data synchronization</p>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>API Rate Limit</span>
              <span className="text-green-600">Within limits</span>
            </div>
            <div className="flex justify-between">
              <span>Data Freshness</span>
              <span className="text-blue-600">&lt; 1 hour</span>
            </div>
            <div className="flex justify-between">
              <span>Error Rate</span>
              <span className="text-green-600">&lt; 1%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourcesOverviewTab;
