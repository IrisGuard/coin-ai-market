
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, TrendingUp } from 'lucide-react';
import { useGeographicRegions, useEnhancedExternalSources } from '@/hooks/useEnhancedAdminSources';

const GeographicSourceMap = () => {
  const { data: regions } = useGeographicRegions();
  const { data: sources } = useEnhancedExternalSources();

  // Group sources by region
  const sourcesByRegion = sources?.reduce((acc: any, source: any) => {
    const regionName = source.geographic_regions?.name || 'Unknown';
    if (!acc[regionName]) {
      acc[regionName] = [];
    }
    acc[regionName].push(source);
    return acc;
  }, {}) || {};

  const mockRegionData = [
    {
      name: "North America",
      code: "NA",
      continent: "North America",
      sourceCount: 45,
      activeCount: 42,
      topCategories: ["Auction Houses", "Marketplaces", "Reference Guides"],
      averageReliability: 94.2,
      trend: "up"
    },
    {
      name: "Europe", 
      code: "EU",
      continent: "Europe",
      sourceCount: 65,
      activeCount: 58,
      topCategories: ["Auction Houses", "Dealers", "Forums & Communities"],
      averageReliability: 89.7,
      trend: "up"
    },
    {
      name: "Asia Pacific",
      code: "APAC", 
      continent: "Asia",
      sourceCount: 25,
      activeCount: 22,
      topCategories: ["Dealers", "Government Mints", "Marketplaces"],
      averageReliability: 86.3,
      trend: "stable"
    },
    {
      name: "Latin America",
      code: "LATAM",
      continent: "South America", 
      sourceCount: 12,
      activeCount: 10,
      topCategories: ["Dealers", "Government Mints"],
      averageReliability: 78.1,
      trend: "up"
    },
    {
      name: "Middle East & Africa",
      code: "MEA",
      continent: "Africa",
      sourceCount: 8,
      activeCount: 6,
      topCategories: ["Dealers", "Government Mints"],
      averageReliability: 72.4,
      trend: "stable"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <div className="h-4 w-4" />;
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Geographic Source Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Global coverage and regional performance metrics
        </p>
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRegionData.map((region) => (
          <Card key={region.code}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  {region.name}
                </div>
                <Badge variant="outline">{region.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Sources</div>
                  <div className="text-2xl font-bold">{region.sourceCount}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Active</div>
                  <div className="text-2xl font-bold text-green-600">{region.activeCount}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Reliability Score</span>
                  {getTrendIcon(region.trend)}
                </div>
                <div className={`text-xl font-bold ${getReliabilityColor(region.averageReliability)}`}>
                  {region.averageReliability}%
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Top Categories</div>
                <div className="flex flex-wrap gap-1">
                  {region.topCategories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Continent: {region.continent}</span>
                  <MapPin className="h-3 w-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Global Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">155</div>
              <div className="text-sm text-muted-foreground">Total Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">138</div>
              <div className="text-sm text-muted-foreground">Active Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">6</div>
              <div className="text-sm text-muted-foreground">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">89.1%</div>
              <div className="text-sm text-muted-foreground">Global Avg Reliability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicSourceMap;
