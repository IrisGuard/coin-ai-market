
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Globe, Search, TrendingUp, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { enableAIGlobalIntegration, discoverCoinDataGlobally, getGlobalMarketIntelligence } from '@/utils/enhancedSecurityConfig';

interface GlobalAIIntegrationProps {
  onDataDiscovered?: (data: any) => void;
}

const GlobalAIIntegration: React.FC<GlobalAIIntegrationProps> = ({ onDataDiscovered }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [globalStatus, setGlobalStatus] = useState<any>(null);
  const [discoveredData, setDiscoveredData] = useState<any>(null);
  const [marketIntelligence, setMarketIntelligence] = useState<any>(null);

  useEffect(() => {
    // Initialize global AI integration on component mount
    initializeGlobalAI();
  }, []);

  const initializeGlobalAI = async () => {
    try {
      const result = await enableAIGlobalIntegration();
      setGlobalStatus(result);
      
      if (result.success) {
        toast.success('AI Brain Global Integration Active');
        // Get initial market intelligence
        const marketData = await getGlobalMarketIntelligence();
        setMarketIntelligence(marketData);
      }
    } catch (error) {
      console.error('Failed to initialize global AI:', error);
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a coin identifier to search');
      return;
    }

    setIsSearching(true);
    try {
      const result = await discoverCoinDataGlobally(searchQuery);
      
      if (result.success) {
        setDiscoveredData(result.data);
        if (onDataDiscovered) {
          onDataDiscovered(result.data);
        }
        toast.success(`Found data from ${result.sources_used?.length || 0} global sources`);
      } else {
        toast.error(result.message || 'Failed to discover coin data');
      }
    } catch (error) {
      console.error('Global search error:', error);
      toast.error('Global search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Global AI Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Brain Global Integration
            {globalStatus?.success && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                ACTIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Global Data Access</span>
              <Badge variant={globalStatus?.globalDataAccess ? "default" : "secondary"}>
                {globalStatus?.globalDataAccess ? "ON" : "OFF"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm">Zero API Keys</span>
              <Badge variant={globalStatus?.zeroApiKeys ? "default" : "secondary"}>
                {globalStatus?.zeroApiKeys ? "YES" : "NO"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Real-time Discovery</span>
              <Badge variant={globalStatus?.realTimeDiscovery ? "default" : "secondary"}>
                {globalStatus?.realTimeDiscovery ? "LIVE" : "OFF"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Coin Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Coin Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coin name, year, country, or any identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGlobalSearch()}
            />
            <Button 
              onClick={handleGlobalSearch}
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Brain className="h-4 w-4 animate-pulse" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Discover
                </>
              )}
            </Button>
          </div>

          {discoveredData && (
            <div className="mt-4 p-4 border rounded-lg bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Global Discovery Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Coin:</strong> {discoveredData.data?.name || 'Unknown'}
                </div>
                <div>
                  <strong>Year:</strong> {discoveredData.data?.year || 'Unknown'}
                </div>
                <div>
                  <strong>Country:</strong> {discoveredData.data?.country || 'Unknown'}
                </div>
                <div>
                  <strong>Estimated Value:</strong> ${discoveredData.data?.estimated_value || 'Unknown'}
                </div>
              </div>
              <div className="mt-2">
                <strong>Sources Used:</strong> {discoveredData.sources_used?.join(', ') || 'None'}
              </div>
              <div className="mt-2">
                <strong>Confidence Score:</strong> {Math.round((discoveredData.confidence_score || 0) * 100)}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Intelligence */}
      {marketIntelligence?.success && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Global Market Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {marketIntelligence.data?.active_users_24h || 0}
                </div>
                <p className="text-xs text-gray-600">Active Users 24h</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {marketIntelligence.data?.searches_24h || 0}
                </div>
                <p className="text-xs text-gray-600">Global Searches 24h</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {marketIntelligence.data?.new_listings_24h || 0}
                </div>
                <p className="text-xs text-gray-600">New Listings 24h</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  ${marketIntelligence.data?.revenue_24h || 0}
                </div>
                <p className="text-xs text-gray-600">Revenue 24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalAIIntegration;
