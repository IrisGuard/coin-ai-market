
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe, TrendingUp, Database, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExternalSource {
  id: string;
  source_name: string;
  base_url: string;
  market_focus: string[] | string;
  is_active: boolean;
  reliability_score: number;
  success_rate?: number;
}

interface ScanResult {
  source: string;
  results_found: number;
  confidence: number;
  market_data: any;
  last_scan: string;
}

const AISourceDiscovery = () => {
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  // Fetch external sources data (simplified)
  const { data: externalSources = [], isLoading } = useQuery({
    queryKey: ['external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('id, source_name, base_url, market_focus, is_active, reliability_score')
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Real-time external scanning status (simplified)
  const { data: realtimeData } = useQuery({
    queryKey: ['ai-source-discovery-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coin_data_cache')
        .select('source_name, raw_data, created_at')
        .eq('data_type', 'web_discovery')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000
  });

  const triggerExternalScan = async (coinName: string = "Morgan Silver Dollar 1921") => {
    setActiveScan(coinName);
    
    try {
      console.log('🔍 Triggering external web discovery scan...');
      
      const { data, error } = await supabase.functions.invoke('web-discovery-engine', {
        body: {
          analysisId: crypto.randomUUID(),
          coinData: {
            name: coinName,
            year: 1921,
            country: "United States",
            denomination: "1 Dollar"
          },
          sources: ['ebay_global', 'heritage', 'pcgs', 'ngc', 'numista'],
          maxResults: 25
        }
      });

      if (error) throw error;

      // Process scan results
      const newResults: ScanResult[] = (data.results || []).map((result: any) => ({
        source: result.sourceType,
        results_found: 1,
        confidence: result.confidence,
        market_data: result.priceData,
        last_scan: new Date().toISOString()
      }));

      setScanResults(newResults);
      toast.success(`External scan completed! Found ${data.resultsFound} results from ${data.sources.length} sources.`);
      
    } catch (error: any) {
      console.error('External scan error:', error);
      toast.error(`Scan failed: ${error.message}`);
    } finally {
      setActiveScan(null);
    }
  };

  const getSourceStatus = (source: ExternalSource) => {
    if (!source.is_active) return 'inactive';
    if (source.reliability_score > 0.8) return 'excellent';
    if (source.reliability_score > 0.6) return 'good';
    return 'fair';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 animate-pulse" />
            AI Source Discovery Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            AI External Source Discovery
            <Badge className="bg-green-100 text-green-800">
              {externalSources.filter(s => s.is_active).length} Active Sources
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Global Coin Discovery Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time scanning of eBay, auctions, numismatic databases, and collector sites
                </p>
              </div>
              <Button
                onClick={() => triggerExternalScan()}
                disabled={!!activeScan}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {activeScan ? (
                  <>
                    <Search className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Test Scan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* External Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalSources.map((source) => {
              const status = getSourceStatus(source);
              return (
                <div key={source.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{source.source_name}</h4>
                    <Badge className={`text-xs ${getStatusColor(status)} border`}>
                      {status === 'excellent' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {status === 'good' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {status === 'fair' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {status === 'inactive' && <Clock className="h-3 w-3 mr-1" />}
                      {status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Market: {Array.isArray(source.market_focus) ? source.market_focus.join(', ') : source.market_focus}</div>
                    <div>Reliability: {Math.round(source.reliability_score * 100)}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Scan Results */}
          {scanResults.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Latest Scan Results
              </h3>
              <div className="grid gap-2">
                {scanResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">{result.source}</div>
                        <div className="text-xs text-muted-foreground">
                          {result.results_found} results • {Math.round(result.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Live Data
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Activity */}
          {realtimeData && realtimeData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Real-time Discovery Activity
              </h3>
              <div className="space-y-2">
                {realtimeData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>{item.source_name}</span>
                    </div>
                     <div className="flex items-center gap-2">
                       <span className="text-muted-foreground">
                         {item.raw_data?.confidence ? Math.round(item.raw_data.confidence * 100) : 75}% confidence
                       </span>
                       <span className="text-xs text-muted-foreground">
                         {new Date(item.created_at).toLocaleTimeString()}
                       </span>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISourceDiscovery;
