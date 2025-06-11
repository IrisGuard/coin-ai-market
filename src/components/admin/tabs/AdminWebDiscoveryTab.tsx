
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Search, 
  ExternalLink,
  TrendingUp,
  Activity,
  DollarSign,
  Target,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminWebDiscoveryTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Fetch web discovery data
  const { data: discoveryData = [], isLoading } = useQuery({
    queryKey: ['admin-web-discovery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('web_discovery_results')
        .select(`
          *,
          dual_image_analysis!web_discovery_results_analysis_id_fkey (
            id,
            analysis_results,
            user_id
          )
        `)
        .order('last_scraped', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get statistics
  const stats = {
    totalResults: discoveryData.length,
    activeSources: [...new Set(discoveryData.map(d => d.source_type))].length,
    highMatches: discoveryData.filter(d => (d.coin_match_confidence || 0) > 0.8).length,
    avgConfidence: discoveryData.length > 0 
      ? Math.round((discoveryData.reduce((sum, d) => sum + (d.coin_match_confidence || 0), 0) / discoveryData.length) * 100)
      : 0
  };

  const sourceTypes = [...new Set(discoveryData.map(d => d.source_type))];

  const filteredData = discoveryData.filter(result => {
    const matchesSearch = !searchTerm || 
      result.source_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.source_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || result.source_type === sourceFilter;
    
    return matchesSearch && matchesSource;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Web Discovery Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage web discovery results from external sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResults}</div>
            <p className="text-xs text-muted-foreground">All discoveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSources}</div>
            <p className="text-xs text-muted-foreground">Data sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Matches</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highMatches}</div>
            <p className="text-xs text-muted-foreground">Above 80% match</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Match</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
            <p className="text-xs text-muted-foreground">Match confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Discovery Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by URL or source type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Sources</option>
              {sourceTypes.map(source => (
                <option key={source} value={source}>
                  {source.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Results Table */}
          <div className="space-y-4">
            {filteredData.map((result) => (
              <div key={result.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {result.source_type.toUpperCase()}
                    </Badge>
                    <Badge variant={
                      (result.coin_match_confidence || 0) > 0.8 ? 'default' : 
                      (result.coin_match_confidence || 0) > 0.5 ? 'secondary' : 'destructive'
                    }>
                      {Math.round((result.coin_match_confidence || 0) * 100)}% match
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(result.last_scraped).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={result.source_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">URL:</span>{' '}
                    <span className="truncate">{result.source_url}</span>
                  </div>
                  <div>
                    <span className="font-medium">Price Data:</span>{' '}
                    {(result.price_data as any)?.current_price ? 
                      `$${(result.price_data as any).current_price}` : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Images:</span>{' '}
                    {(result.image_urls || []).length} found
                  </div>
                </div>

                {/* Extracted data preview */}
                {result.extracted_data && (
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <span className="font-medium">Extracted:</span>{' '}
                    {JSON.stringify(result.extracted_data).substring(0, 200)}...
                  </div>
                )}
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No web discovery results found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWebDiscoveryTab;
