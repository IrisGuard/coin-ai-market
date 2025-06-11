
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  MapPin, 
  TrendingUp, 
  Filter,
  DollarSign,
  Target,
  Eye,
  Activity
} from 'lucide-react';
import { GeographicSource, getSourcesByRegion, getSourceMetrics } from './sources/utils';

interface GeographicSourceMapProps {
  sources: GeographicSource[];
}

const GeographicSourceMap: React.FC<GeographicSourceMapProps> = ({ sources }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  
  const sourcesByRegion = getSourcesByRegion(sources);
  const metrics = getSourceMetrics(sources);
  
  const filteredSources = sources.filter(source => {
    const matchesRegion = selectedRegion === 'all' || source.region === selectedRegion;
    const matchesCurrency = selectedCurrency === 'all' || source.currency === selectedCurrency;
    return matchesRegion && matchesCurrency;
  });

  const regions = Object.keys(sourcesByRegion);
  const currencies = [...new Set(sources.map(s => s.currency))];

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.9) return 'bg-green-100 text-green-800';
    if (reliability >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRegionIcon = (region: string) => {
    switch (region) {
      case 'North America': return '🌎';
      case 'Europe': return '🌍';
      case 'Asia': return '🌏';
      case 'Oceania': return '🏝️';
      default: return '🌐';
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
      'CAD': 'C$', 'AUD': 'A$', 'CHF': 'Fr', 'SGD': 'S$', 'PLN': 'zł'
    };
    return symbols[currency as keyof typeof symbols] || currency;
  };

  return (
    <div className="space-y-6">
      {/* Global Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Sources</p>
                <p className="text-2xl font-bold">{metrics.totalSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg Reliability</p>
                <p className="text-2xl font-bold">{(metrics.avgReliability * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Error Focused</p>
                <p className="text-2xl font-bold">{metrics.errorFocusedSources}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Regions</p>
                <p className="text-2xl font-bold">{metrics.uniqueRegions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Currencies</p>
                <p className="text-2xl font-bold">{metrics.uniqueCurrencies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Coverage</p>
                <p className="text-2xl font-bold">{metrics.coveragePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="map">Geographic Map</TabsTrigger>
            <TabsTrigger value="regions">By Region</TabsTrigger>
            <TabsTrigger value="currencies">By Currency</TabsTrigger>
            <TabsTrigger value="list">Detailed List</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Currencies</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>eBay International Sources Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interactive World Map</h3>
                <p className="text-muted-foreground mb-4">
                  Visual representation of all {filteredSources.length} eBay international sources
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {Object.entries(sourcesByRegion).map(([region, regionSources]) => (
                    <div key={region} className="text-center">
                      <div className="text-2xl mb-1">{getRegionIcon(region)}</div>
                      <div className="font-medium text-sm">{region}</div>
                      <div className="text-muted-foreground text-xs">{regionSources.length} sources</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          {Object.entries(sourcesByRegion).map(([region, regionSources]) => (
            <Card key={region}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getRegionIcon(region)}</span>
                  {region}
                  <Badge variant="outline">{regionSources.length} sources</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionSources.map(source => (
                    <div key={source.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{source.country}</h4>
                        <Badge className={getReliabilityColor(source.reliability)}>
                          {(source.reliability * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{source.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getCurrencySymbol(source.currency)}</span>
                        {source.errorFocus && (
                          <Badge variant="secondary" className="text-xs">Error Focus</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="currencies" className="space-y-4">
          {currencies.map(currency => {
            const currencySources = sources.filter(s => s.currency === currency);
            return (
              <Card key={currency}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{getCurrencySymbol(currency)}</span>
                    {currency}
                    <Badge variant="outline">{currencySources.length} sources</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currencySources.map(source => (
                      <div key={source.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{source.country}</span>
                          <Badge className={getReliabilityColor(source.reliability)}>
                            {(source.reliability * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{source.region}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All eBay International Sources ({filteredSources.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredSources.map(source => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getRegionIcon(source.region)}</span>
                      <div>
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {source.country} • {source.region}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{getCurrencySymbol(source.currency)}</span>
                      
                      {source.errorFocus && (
                        <Badge variant="secondary">Error Focus</Badge>
                      )}
                      
                      <Badge className={getReliabilityColor(source.reliability)}>
                        {(source.reliability * 100).toFixed(0)}% reliable
                      </Badge>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeographicSourceMap;
