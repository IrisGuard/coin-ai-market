
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useExternalSources } from '@/hooks/admin/useAdminDataSources';
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
  const { data: dataSources, isLoading } = useExternalSources();

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
    if (!timestamp) return 'Never';
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

  const dataSourceStats = {
    total_sources: dataSources?.length || 0,
    active_sources: dataSources?.filter(s => s.is_active)?.length || 0,
    avg_success_rate: dataSources?.length ? dataSources.reduce((sum, s) => sum + (s.reliability_score || 0), 0) / dataSources.length * 100 : 0,
    total_requests_24h: 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
        <p>Loading data sources...</p>
      </div>
    );
  }

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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.active_sources}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.avg_success_rate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests (24h)</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSourceStats.total_requests_24h}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources List */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data sources configured yet
              </div>
            ) : (
              dataSources?.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{source.source_name}</div>
                    <div className="text-sm text-muted-foreground">{source.base_url}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={source.is_active ? "default" : "secondary"}>
                        {source.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge className={getTypeColor(source.source_type)}>
                        {source.source_type}
                      </Badge>
                      <Badge variant="outline">
                        Priority: {source.priority_score || 50}
                      </Badge>
                      <Badge variant="outline">
                        Rate: {source.rate_limit_per_hour || 60}/hr
                      </Badge>
                      <Badge variant="outline">
                        Reliability: {Math.round((source.reliability_score || 0.5) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Shield className="h-4 w-4" />
                      Test
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                      Run
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
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
