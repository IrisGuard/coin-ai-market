
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Globe, Zap, Settings } from 'lucide-react';
import { useExternalPriceSources } from '@/hooks/useEnhancedDataSources';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AISourceDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: externalSources, isLoading } = useExternalPriceSources();

  // Get source categories
  const { data: categories } = useQuery({
    queryKey: ['source-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get geographic regions
  const { data: regions } = useQuery({
    queryKey: ['geographic-regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geographic_regions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredSources = externalSources?.filter(source =>
    source.source_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.source_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <div className="p-4">Loading AI source discovery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Source Discovery</h2>
          <p className="text-muted-foreground">Discover and manage external data sources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Auto Discover
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure AI
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">External Sources</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search external sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{source.source_name}</CardTitle>
                    <Badge variant={source.is_active ? "default" : "secondary"}>
                      {source.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {source.source_type}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{source.base_url}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Rate Limit:</span>
                    <span>{source.rate_limit_per_hour}/hour</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Priority:</span>
                    <Badge variant="outline">{source.priority_score}</Badge>
                  </div>
                  {source.requires_proxy && (
                    <Badge variant="outline" className="text-xs">
                      Requires Proxy
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No external sources found. Click "Auto Discover" to find new sources.
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <h4 className="font-semibold">{category.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                  {category.icon && (
                    <Badge variant="outline" className="mt-2">
                      {category.icon}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions?.map((region) => (
              <Card key={region.id}>
                <CardContent className="p-4">
                  <h4 className="font-semibold">{region.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {region.code} • {region.continent}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISourceDiscovery;
