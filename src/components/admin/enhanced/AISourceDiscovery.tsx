
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Search, Brain, Globe, Target, Zap, CheckCircle } from 'lucide-react';
import { useAISourceDiscovery, useSourceCategories, useGeographicRegions } from '@/hooks/useEnhancedAdminSources';

const AISourceDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const { data: categories } = useSourceCategories();
  const { data: regions } = useGeographicRegions();
  const aiDiscovery = useAISourceDiscovery();

  const handleDiscover = async () => {
    setIsDiscovering(true);
    try {
      const result = await aiDiscovery.mutateAsync({
        query: searchQuery,
        category: selectedCategory,
        region: selectedRegion,
        limit: 20
      });
      setDiscoveryResults(result.sources || []);
    } catch (error) {
      console.error('Discovery failed:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const mockDiscoveryResults = [
    {
      name: "CoinWorld Marketplace",
      url: "https://coinworld.com/marketplace",
      confidence: 0.92,
      category: "marketplace",
      region: "North America",
      estimated_volume: "High",
      detection_method: "AI Pattern Recognition",
      features: ["Search", "Filters", "Seller Ratings", "Price History"]
    },
    {
      name: "European Numismatic Exchange",
      url: "https://en-exchange.eu", 
      confidence: 0.87,
      category: "auction",
      region: "Europe",
      estimated_volume: "Medium",
      detection_method: "Content Analysis",
      features: ["Auctions", "Direct Sales", "Authentication"]
    },
    {
      name: "Asian Coin Portal",
      url: "https://asiancoinportal.com",
      confidence: 0.81,
      category: "dealer",
      region: "Asia Pacific", 
      estimated_volume: "Medium",
      detection_method: "Network Analysis",
      features: ["Inventory", "Pricing", "Certifications"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Discovery Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Source Discovery Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Query</label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 'coin auction sites', 'numismatic dealers'"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any category</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Any region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any region</SelectItem>
                  {regions?.map((region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name} ({region.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isDiscovering && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600 animate-pulse" />
                <span className="text-sm">AI discovery in progress...</span>
              </div>
              <Progress value={67} className="w-full" />
              <div className="text-xs text-muted-foreground">
                Analyzing web patterns and market indicators...
              </div>
            </div>
          )}

          <Button 
            onClick={handleDiscover}
            disabled={!searchQuery || isDiscovering}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            {isDiscovering ? 'Discovering...' : 'Start AI Discovery'}
          </Button>
        </CardContent>
      </Card>

      {/* Discovery Results */}
      <Card>
        <CardHeader>
          <CardTitle>Discovery Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(discoveryResults.length > 0 ? discoveryResults : mockDiscoveryResults).map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold">{result.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${
                          result.confidence >= 0.9 ? 'text-green-600 border-green-200' :
                          result.confidence >= 0.8 ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }`}
                      >
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {result.url}
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{result.category}</Badge>
                      <Badge variant="outline">{result.region}</Badge>
                      <Badge variant="outline">Volume: {result.estimated_volume}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Detection Method:</span>
                    <div className="text-muted-foreground">{result.detection_method}</div>
                  </div>
                  <div>
                    <span className="font-medium">Detected Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.features.map((feature: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Target className="h-4 w-4 mr-1" />
                    Analyze Structure
                  </Button>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Add to Sources
                  </Button>
                  <Button size="sm" variant="outline">
                    Test Connection
                  </Button>
                </div>
              </div>
            ))}

            {discoveryResults.length === 0 && !isDiscovering && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a discovery search to find new coin market sources</p>
                <p className="text-sm">AI will analyze the web for potential trading platforms</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISourceDiscovery;
