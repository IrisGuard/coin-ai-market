
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Globe, Key, Zap, Settings, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminDataSourcesSection = () => {
  const dataSourceTables = [
    {
      name: 'data_sources',
      description: 'External data source configurations',
      records: '23',
      status: 'active',
      icon: Database,
      uptime: '99.8%'
    },
    {
      name: 'external_price_sources',
      description: 'Coin pricing data sources',
      records: '15',
      status: 'active',
      icon: Globe,
      uptime: '98.5%'
    },
    {
      name: 'api_keys',
      description: 'API key management and rotation',
      records: '34',
      status: 'active',
      icon: Key,
      uptime: '100%'
    },
    {
      name: 'scraping_jobs',
      description: 'Web scraping job configurations',
      records: '67',
      status: 'active',
      icon: Zap,
      uptime: '97.2%'
    },
    {
      name: 'coin_data_cache',
      description: 'Cached coin data for performance',
      records: '12,345',
      status: 'active',
      icon: Settings,
      uptime: '99.9%'
    },
    {
      name: 'data_quality_reports',
      description: 'Data quality monitoring reports',
      records: '456',
      status: 'active',
      icon: Activity,
      uptime: '99.5%'
    }
  ];

  const dataSourceStats = [
    { label: 'Active Sources', value: '23', icon: Database, color: 'text-blue-600' },
    { label: 'API Keys', value: '34', icon: Key, color: 'text-green-600' },
    { label: 'Scraping Jobs', value: '67', icon: Zap, color: 'text-purple-600' },
    { label: 'Cache Hit Rate', value: '94.2%', icon: Settings, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Data Sources Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dataSourceStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Data integration</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Source Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        {dataSourceTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-cyan-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{table.records}</span> records
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {table.uptime} uptime
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Monitor
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Source Health */}
      <Card>
        <CardHeader>
          <CardTitle>Data Source Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                source: 'PCGS Price Guide API',
                status: 'operational',
                lastSync: '2 minutes ago',
                records: '1,234'
              },
              {
                source: 'NGC Registry Data',
                status: 'operational',
                lastSync: '5 minutes ago',
                records: '987'
              },
              {
                source: 'Heritage Auctions Feed',
                status: 'maintenance',
                lastSync: '2 hours ago',
                records: '2,345'
              },
              {
                source: 'eBay Sold Listings',
                status: 'operational',
                lastSync: '1 minute ago',
                records: '5,678'
              }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    source.status === 'operational' ? 'bg-green-500' :
                    source.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.records} records • Last sync: {source.lastSync}
                    </p>
                  </div>
                </div>
                <Badge variant={source.status === 'operational' ? 'default' : 'secondary'}>
                  {source.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesSection;
