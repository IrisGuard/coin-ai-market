
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, Shield } from 'lucide-react';
import { useDataSources, useVPNProxies } from '@/hooks/useDataSources';
import DataSourceCard from '../components/DataSourceCard';
import ProxyCard from '../components/ProxyCard';

const AdminDataSourcesTab = () => {
  const { data: dataSources = [], isLoading: sourcesLoading } = useDataSources();
  const { data: proxies = [], isLoading: proxiesLoading } = useVPNProxies();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSource, setSelectedSource] = useState<unknown>(null);

  const handleEditSource = (source: unknown) => {
    console.log('Edit source:', source);
  };

  const handleDeleteSource = (id: string) => {
    console.log('Delete source:', id);
  };

  const handleEditProxy = (proxy: unknown) => {
    console.log('Edit proxy:', proxy);
  };

  const handleDeleteProxy = (id: string) => {
    console.log('Delete proxy:', id);
  };

  const handleTestProxy = (id: string) => {
    console.log('Test proxy:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Sources & Proxies</h3>
          <p className="text-sm text-muted-foreground">
            Manage external data sources and VPN proxy connections
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Sources ({dataSources.length})
          </TabsTrigger>
          <TabsTrigger value="proxies" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            VPN Proxies ({proxies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          {sourcesLoading ? (
            <div className="text-center py-8">Loading data sources...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map((source) => (
                <DataSourceCard
                  key={source.id}
                  name={source.name}
                  url={source.url}
                  type={source.type}
                  is_active={source.is_active}
                  success_rate={source.success_rate}
                  last_used={source.last_used}
                  onEdit={() => handleEditSource(source)}
                  onDelete={() => handleDeleteSource(source.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="proxies">
          {proxiesLoading ? (
            <div className="text-center py-8">Loading VPN proxies...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proxies.map((proxy) => (
                <ProxyCard
                  key={proxy.id}
                  name={proxy.name}
                  country_code={proxy.country_code}
                  type={proxy.type}
                  is_active={proxy.is_active}
                  success_rate={proxy.success_rate}
                  last_used={proxy.last_used}
                  onEdit={() => handleEditProxy(proxy)}
                  onDelete={() => handleDeleteProxy(proxy.id)}
                  onTest={() => handleTestProxy(proxy.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDataSourcesTab;
