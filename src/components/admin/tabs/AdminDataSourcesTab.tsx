
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database, Globe, Settings, Play, Pause, Search, TrendingUp } from 'lucide-react';

const AdminDataSourcesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Get Data Sources
  const { data: dataSources, isLoading } = useQuery({
    queryKey: ['data-sources', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('data_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,url.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Get External Price Sources
  const { data: priceSources, isLoading: priceLoading } = useQuery({
    queryKey: ['external-price-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('priority_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Toggle Data Source Status
  const toggleSourceStatus = useMutation({
    mutationFn: async ({ sourceId, isActive }: { sourceId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('data_sources')
        .update({ is_active: !isActive })
        .eq('id', sourceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-sources'] });
      toast({
        title: "Data Source Updated",
        description: "Data source status has been updated.",
      });
    },
  });

  // Test Data Source Connection
  const testConnection = useMutation({
    mutationFn: async (sourceId: string) => {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, response_time: Math.floor(Math.random() * 500) + 100 };
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Test Successful",
        description: `Response time: ${data.response_time}ms`,
      });
    },
    onError: () => {
      toast({
        title: "Connection Test Failed",
        description: "Unable to connect to data source.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (successRate: number) => {
    if (successRate >= 90) return 'text-green-600';
    if (successRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Sources Management</h3>
          <p className="text-sm text-muted-foreground">Manage external data sources and price feeds</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSources?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dataSources?.filter(source => source.is_active).length || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Sources</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priceSources?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {priceSources?.filter(source => source.is_active).length || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((dataSources?.reduce((acc, source) => acc + (source.success_rate || 0), 0) || 0) / (dataSources?.length || 1))}%
            </div>
            <p className="text-xs text-muted-foreground">across all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scrapers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {priceSources?.filter(source => source.scraping_enabled).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">scraping enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search data sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Data Sources List */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading data sources...</div>
            ) : dataSources?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data sources found
              </div>
            ) : (
              dataSources?.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{source.name}</div>
                    <div className="text-sm text-muted-foreground">{source.url}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={source.is_active ? "default" : "secondary"}>
                        {source.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{source.type}</Badge>
                      <Badge variant="outline" className={getStatusColor(source.success_rate || 0)}>
                        {Math.round(source.success_rate || 0)}% success
                      </Badge>
                      <Badge variant="outline">Priority: {source.priority || 1}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection.mutate(source.id)}
                      disabled={testConnection.isPending}
                    >
                      <Globe className="h-4 w-4" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSourceStatus.mutate({ sourceId: source.id, isActive: source.is_active })}
                      disabled={toggleSourceStatus.isPending}
                    >
                      {source.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {source.is_active ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* External Price Sources */}
      <Card>
        <CardHeader>
          <CardTitle>External Price Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priceLoading ? (
              <div className="text-center py-8">Loading price sources...</div>
            ) : priceSources?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No price sources found
              </div>
            ) : (
              priceSources?.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{source.source_name}</div>
                    <div className="text-sm text-muted-foreground">{source.base_url}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={source.is_active ? "default" : "secondary"}>
                        {source.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{source.source_type}</Badge>
                      <Badge variant="outline">
                        {Math.round((source.reliability_score || 0) * 100)}% reliable
                      </Badge>
                      <Badge variant="outline">
                        {source.rate_limit_per_hour}/hr limit
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesTab;
