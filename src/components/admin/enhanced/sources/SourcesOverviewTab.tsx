
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  TrendingUp, 
  Target, 
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface SourcesOverviewTabProps {
  sources: any[];
}

const SourcesOverviewTab: React.FC<SourcesOverviewTabProps> = ({ sources }) => {
  // Calculate metrics from the sources
  const totalSources = sources?.length || 0;
  const activeSources = sources?.filter(s => s.is_active).length || 0;
  const ebayInternationalSources = sources?.filter(s => 
    s.base_url?.includes('ebay') && s.source_name?.includes('eBay')
  ).length || 0;
  const errorSpecializedSources = sources?.filter(s => s.specializes_in_errors).length || 0;
  const avgReliability = sources?.length ? 
    Math.round((sources.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / sources.length) * 100) : 0;

  // Group sources by type
  const sourcesByType = sources?.reduce((acc, source) => {
    const type = source.source_type || 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(source);
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Get unique currencies
  const uniqueCurrencies = new Set(sources?.flatMap(s => s.supported_currencies || []) || []);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSources}</div>
            <p className="text-xs text-muted-foreground">
              {activeSources} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">eBay International</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ebayInternationalSources}</div>
            <p className="text-xs text-muted-foreground">
              Global coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Specialized</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorSpecializedSources}</div>
            <p className="text-xs text-muted-foreground">
              Error coin focus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reliability</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgReliability}%</div>
            <p className="text-xs text-muted-foreground">
              Quality score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currencies</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCurrencies.size}</div>
            <p className="text-xs text-muted-foreground">
              Global markets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* eBay International Highlight */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              eBay International Integration
            </CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              Global Coverage
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ebayInternationalSources}</div>
              <div className="text-sm text-muted-foreground">International Sites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">16</div>
              <div className="text-sm text-muted-foreground">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-muted-foreground">Continents</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {['🇺🇸 USA', '🇬🇧 UK', '🇩🇪 Germany', '🇫🇷 France', '🇮🇹 Italy', '🇪🇸 Spain', '🇳🇱 Netherlands', '🇧🇪 Belgium'].map((country, i) => (
              <div key={i} className="text-center text-sm bg-white rounded p-2">
                {country}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Real-time price monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Error coin detection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Multi-currency support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sources by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sourcesByType).map(([type, typeSources]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-sm capitalize flex items-center justify-between">
                {type.replace('_', ' ')}
                <Badge variant="outline">{typeSources.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {typeSources.slice(0, 3).map((source, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="truncate">{source.source_name}</span>
                    <div className="flex items-center gap-1">
                      {source.is_active ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {Math.round((source.reliability_score || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
                {typeSources.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{typeSources.length - 3} more...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Source Activity</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sources?.slice(0, 5).map((source, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-sm">{source.source_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {source.source_type} • {Math.round((source.reliability_score || 0) * 100)}% reliable
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={source.is_active ? "default" : "secondary"}>
                    {source.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourcesOverviewTab;
