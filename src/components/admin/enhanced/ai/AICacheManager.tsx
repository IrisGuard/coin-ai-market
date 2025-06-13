
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Search, Trash2, RefreshCw, Eye, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AICacheManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: cacheData, isLoading } = useQuery({
    queryKey: ['ai-recognition-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI cache data:', error);
        throw error;
      }
      
      console.log('✅ AI cache data loaded:', data?.length);
      return data || [];
    }
  });

  const { data: coinDataCache, isLoading: coinCacheLoading } = useQuery({
    queryKey: ['coin-data-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coin_data_cache')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching coin data cache:', error);
        throw error;
      }
      
      console.log('✅ Coin data cache loaded:', data?.length);
      return data || [];
    }
  });

  const filteredCache = cacheData?.filter(cache => 
    cache.image_hash.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalCache: cacheData?.length || 0,
    coinDataCache: coinDataCache?.length || 0,
    avgConfidence: cacheData?.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / (cacheData?.length || 1),
    avgProcessingTime: cacheData?.reduce((sum, c) => sum + (c.processing_time_ms || 0), 0) / (cacheData?.length || 1)
  };

  if (isLoading || coinCacheLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6 text-green-600" />
              AI Recognition Cache Management
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Cache
              </Button>
              <Button variant="outline" className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Old Cache
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cache by image hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalCache}</div>
              <div className="text-sm text-muted-foreground">Recognition Cache</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.coinDataCache}</div>
              <div className="text-sm text-muted-foreground">Coin Data Cache</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats.avgConfidence * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(stats.avgProcessingTime)}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recognition Cache
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image Hash</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Sources</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCache.slice(0, 10).map((cache) => (
                  <TableRow key={cache.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {cache.image_hash.substring(0, 12)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cache.confidence_score > 0.8 ? 'default' : 'secondary'}>
                        {Math.round((cache.confidence_score || 0) * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {cache.processing_time_ms}ms
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {cache.sources_consulted?.length || 0} sources
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Coin Data Cache
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coinDataCache?.slice(0, 10).map((cache) => (
                  <TableRow key={cache.id}>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {cache.coin_identifier}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {cache.source_name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(cache.last_updated).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {cache.expires_at ? new Date(cache.expires_at).toLocaleDateString() : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICacheManager;
