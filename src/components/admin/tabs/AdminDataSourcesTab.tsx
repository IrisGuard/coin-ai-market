
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Plus, 
  Globe, 
  Shield, 
  Activity,
  TrendingUp,
  RefreshCw,
  Edit,
  Trash2,
  Play
} from 'lucide-react';

const AdminDataSourcesTab = () => {
  const [showForm, setShowForm] = useState(false);

  // Mock data sources
  const mockDataSources = [
    {
      id: '1',
      name: 'Heritage Auctions API',
      url: 'https://api.ha.com',
      type: 'auction_data',
      is_active: true,
      success_rate: 96.8,
      last_used: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      total_requests: 15742,
      priority: 1
    },
    {
      id: '2',
      name: 'PCGS Price Guide',
      url: 'https://www.pcgs.com/prices',
      type: 'price_data',
      is_active: true,
      success_rate: 94.2,
      last_used: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      total_requests: 8934,
      priority: 1
    },
    {
      id: '3',
      name: 'NGC Registry',
      url: 'https://www.ngccoin.com',
      type: 'certification_data',
      is_active: true,
      success_rate: 91.5,
      last_used: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      total_requests: 6721,
      priority: 2
    },
    {
      id: '4',
      name: 'CoinWorld Market Data',
      url: 'https://www.coinworld.com/api',
      type: 'market_data',
      is_active: true,
      success_rate: 89.7,
      last_used: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      total_requests: 4532,
      priority: 2
    },
    {
      id: '5',
      name: 'eBay Sold Listings',
      url: 'https://api.ebay.com/ws/api.dll',
      type: 'market_data',
      is_active: true,
      success_rate: 87.3,
      last_used: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      total_requests: 12456,
      priority: 3
    },
    {
      id: '6',
      name: 'Legacy Krause Data',
      url: 'https://legacy.krause.com',
      type: 'reference_data',
      is_active: false,
      success_rate: 45.2,
      last_used: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      total_requests: 892,
      priority: 5
    }
  ];

  const dataSourceStats = {
    total_sources: mockDataSources.length,
    active_sources: mockDataSources.filter(s => s.is_active).length,
    avg_success_rate: mockDataSources.reduce((sum, s) => sum + s.success_rate, 0) / mockDataSources.length,
    total_requests_24h: 3421
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'auction_data': return 'bg-purple-100 text-purple-800';
      case 'price_data': return 'bg-green-100 text-green-800';
      case 'certification_data': return 'bg-blue-100 text-blue-800';
      case 'market_data': return 'bg-yellow-100 text-yellow-800';
      case 'reference_data': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Sources Management</h3>
          <p className="text-sm text-muted-foreground">Manage external data sources and integrations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      {/* Data Source Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.total_sources}</div>
            <p className="text-xs text-muted-foreground">configured sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.active_sources}</div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.avg_success_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">average reliability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests (24h)</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.total_requests_24h.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">API calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources List */}
      <Card>
        <CardHeader>
          <CardTitle>External Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDataSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{source.name}</span>
                      <Badge variant={source.is_active ? 'default' : 'secondary'}>
                        {source.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge className={getTypeColor(source.type)}>
                        {source.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        Priority {source.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{source.url}</p>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-4">
                      <span>Success rate: {source.success_rate}%</span>
                      <span>Last used: {getTimeAgo(source.last_used)}</span>
                      <span>Total requests: {source.total_requests.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesTab;
