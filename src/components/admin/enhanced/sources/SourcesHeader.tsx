
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Plus, 
  RefreshCw, 
  Settings,
  TrendingUp,
  Shield,
  Zap,
  Target
} from 'lucide-react';

interface SourcesHeaderProps {
  sources: any[];
}

const SourcesHeader: React.FC<SourcesHeaderProps> = ({ sources }) => {
  const activeSources = sources?.filter(s => s.is_active).length || 0;
  const ebayCount = sources?.filter(s => s.base_url?.includes('ebay')).length || 0;
  const errorFocusedCount = sources?.filter(s => s.specializes_in_errors).length || 0;
  const avgReliability = sources?.length ? 
    Math.round((sources.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / sources.length) * 100) : 0;

  return (
    <Card className="border-coin-purple/20 bg-gradient-to-r from-coin-purple/5 to-blue-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-coin-purple/10 rounded-lg">
              <Globe className="h-6 w-6 text-coin-purple" />
            </div>
            <div>
              <CardTitle className="text-2xl">Enhanced Global Sources Manager</CardTitle>
              <p className="text-muted-foreground">
                Comprehensive international eBay integration with advanced error coin detection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Global Coverage */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold">{activeSources}</div>
              <div className="text-sm text-muted-foreground">Active Sources</div>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-xs">
                  {ebayCount} eBay International
                </Badge>
              </div>
            </div>
          </div>

          {/* Error Detection */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-bold">{errorFocusedCount}</div>
              <div className="text-sm text-muted-foreground">Error Specialized</div>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="secondary" className="text-xs">
                  AI Powered
                </Badge>
              </div>
            </div>
          </div>

          {/* Reliability */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold">{avgReliability}%</div>
              <div className="text-sm text-muted-foreground">Avg Reliability</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">High Quality</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-lg font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                  Real-time
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Global eBay Integration Highlights</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>16 international eBay sites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Multi-currency price comparison</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Advanced error coin detection</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SourcesHeader;
