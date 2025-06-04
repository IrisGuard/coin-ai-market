
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataSources, useVPNProxies, useCreateScrapingJob, useUpdateDataSource } from '@/hooks/useDataSources';
import { Activity, Globe, Shield, Database, Zap, Plus, Settings } from 'lucide-react';

const AdminDataSourcesTab = () => {
  const { data: dataSources, isLoading: sourcesLoading } = useDataSources();
  const { data: vpnProxies, isLoading: vpnLoading } = useVPNProxies();
  const createScrapingJob = useCreateScrapingJob();
  const updateDataSource = useUpdateDataSource();
  
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedProxy, setSelectedProxy] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [jobType, setJobType] = useState('coin_data');

  const handleCreateScrapingJob = () => {
    if (!selectedSource || !targetUrl) return;
    
    createScrapingJob.mutate({
      source_id: selectedSource,
      proxy_id: selectedProxy || undefined,
      target_url: targetUrl,
      job_type: jobType,
    });
    
    setTargetUrl('');
  };

  const handleToggleSource = (sourceId: string, isActive: boolean) => {
    updateDataSource.mutate({
      id: sourceId,
      updates: { is_active: isActive }
    });
  };

  if (sourcesLoading || vpnLoading) {
    return <div>Loading data sources...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSources?.filter(s => s.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {dataSources?.length || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VPN Proxies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vpnProxies?.filter(v => v.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.7K</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Scraping Job Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Create Scraping Job
          </CardTitle>
          <CardDescription>
            Queue a new web scraping job with VPN protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {dataSources?.filter(s => s.is_active).map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedProxy} onValueChange={setSelectedProxy}>
              <SelectTrigger>
                <SelectValue placeholder="VPN/Proxy (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No proxy</SelectItem>
                {vpnProxies?.filter(v => v.is_active).map((proxy) => (
                  <SelectItem key={proxy.id} value={proxy.id}>
                    {proxy.name} ({proxy.country_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coin_data">Coin Data</SelectItem>
                <SelectItem value="market_prices">Market Prices</SelectItem>
                <SelectItem value="auction_results">Auction Results</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Target URL"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />

            <Button 
              onClick={handleCreateScrapingJob}
              disabled={!selectedSource || !targetUrl || createScrapingJob.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Queue Job
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>
            Manage your data collection sources and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSources?.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>
                    <Badge variant={source.type === 'api' ? 'default' : 'secondary'}>
                      {source.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={source.is_active}
                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                      />
                      <span className="text-sm">
                        {source.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{source.success_rate}%</TableCell>
                  <TableCell>
                    {source.last_used ? new Date(source.last_used).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configure {source.name}</DialogTitle>
                          <DialogDescription>
                            Adjust settings for this data source
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Rate Limit (requests/hour)</label>
                            <Input type="number" value={source.rate_limit} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Priority</label>
                            <Input type="number" value={source.priority} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Configuration JSON</label>
                            <textarea 
                              className="w-full p-2 border rounded"
                              rows={4}
                              value={JSON.stringify(source.config, null, 2)}
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* VPN/Proxy Management */}
      <Card>
        <CardHeader>
          <CardTitle>VPN & Proxy Management</CardTitle>
          <CardDescription>
            Monitor and manage your anonymous browsing infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vpnProxies?.map((proxy) => (
                <TableRow key={proxy.id}>
                  <TableCell className="font-medium">{proxy.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proxy.type}</Badge>
                  </TableCell>
                  <TableCell>{proxy.country_code || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge variant={proxy.is_active ? 'default' : 'secondary'}>
                      {proxy.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{proxy.success_rate}%</TableCell>
                  <TableCell>
                    {proxy.last_used ? new Date(proxy.last_used).toLocaleDateString() : 'Never'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDataSourcesTab;
