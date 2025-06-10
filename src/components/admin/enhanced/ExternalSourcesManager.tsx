
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Plus, TestTube, Download, Upload, Activity } from 'lucide-react';
import { useExternalSourcesManagement, useCreateExternalSource, useSourceTesting, useBulkSourceImport } from '@/hooks/admin/useExternalSourcesManagement';

const ExternalSourcesManager = () => {
  const { data: sources = [], isLoading } = useExternalSourcesManagement();
  const createSourceMutation = useCreateExternalSource();
  const testSourceMutation = useSourceTesting();
  const bulkImportMutation = useBulkSourceImport();
  
  const [newSource, setNewSource] = useState({
    source_name: '',
    base_url: '',
    source_type: 'marketplace',
    api_key: '',
    rate_limit_per_hour: 100,
    priority_score: 0.5
  });

  const [bulkData, setBulkData] = useState('');

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSourceMutation.mutateAsync(newSource);
      setNewSource({
        source_name: '',
        base_url: '',
        source_type: 'marketplace',
        api_key: '',
        rate_limit_per_hour: 100,
        priority_score: 0.5
      });
    } catch (error) {
      console.error('Failed to create source:', error);
    }
  };

  const handleTestSource = async (sourceId: string, baseUrl: string) => {
    try {
      await testSourceMutation.mutateAsync({ sourceId, testUrl: baseUrl });
    } catch (error) {
      console.error('Source test failed:', error);
    }
  };

  const handleBulkImport = async () => {
    try {
      const sourcesArray = bulkData.split('\n').filter(line => line.trim()).map(line => {
        const [name, url, type] = line.split(',').map(s => s.trim());
        return {
          source_name: name || 'Unknown Source',
          base_url: url || '',
          source_type: type || 'marketplace',
          priority_score: 0.5
        };
      });
      
      if (sourcesArray.length > 0) {
        await bulkImportMutation.mutateAsync(sourcesArray);
        setBulkData('');
      }
    } catch (error) {
      console.error('Bulk import failed:', error);
    }
  };

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'marketplace': return 'bg-blue-100 text-blue-800';
      case 'auction': return 'bg-purple-100 text-purple-800';
      case 'dealer': return 'bg-green-100 text-green-800';
      case 'api': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading external sources...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            External Sources Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sources" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sources">Active Sources ({sources.length})</TabsTrigger>
              <TabsTrigger value="add">Add Source</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="mt-6">
              <div className="space-y-4">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{source.source_name}</h4>
                        <Badge className={getSourceTypeColor(source.source_type)}>
                          {source.source_type}
                        </Badge>
                        <Badge variant={source.is_active ? 'default' : 'secondary'}>
                          {source.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{source.base_url}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Priority: {(source.priority_score * 100).toFixed(0)}%</span>
                        <span>Rate Limit: {source.rate_limit_per_hour}/hour</span>
                        <span>Reliability: {Math.round((source.reliability_score || 0) * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestSource(source.id, source.base_url)}
                        disabled={testSourceMutation.isPending}
                      >
                        <TestTube className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add" className="mt-6">
              <form onSubmit={handleCreateSource} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source_name">Source Name</Label>
                    <Input
                      id="source_name"
                      value={newSource.source_name}
                      onChange={(e) => setNewSource({ ...newSource, source_name: e.target.value })}
                      placeholder="Enter source name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="source_type">Source Type</Label>
                    <Select
                      value={newSource.source_type}
                      onValueChange={(value) => setNewSource({ ...newSource, source_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="dealer">Dealer</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="base_url">Base URL</Label>
                  <Input
                    id="base_url"
                    value={newSource.base_url}
                    onChange={(e) => setNewSource({ ...newSource, base_url: e.target.value })}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="api_key">API Key (Optional)</Label>
                    <Input
                      id="api_key"
                      type="password"
                      value={newSource.api_key}
                      onChange={(e) => setNewSource({ ...newSource, api_key: e.target.value })}
                      placeholder="Enter API key if required"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate_limit">Rate Limit (per hour)</Label>
                    <Input
                      id="rate_limit"
                      type="number"
                      value={newSource.rate_limit_per_hour}
                      onChange={(e) => setNewSource({ ...newSource, rate_limit_per_hour: parseInt(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                </div>
                <Button type="submit" className="flex items-center gap-2" disabled={createSourceMutation.isPending}>
                  <Plus className="w-4 h-4" />
                  Add External Source
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="bulk" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulk_data">Bulk Import Data</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Enter one source per line in format: Name, URL, Type
                  </p>
                  <textarea
                    id="bulk_data"
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                    placeholder="Heritage Auctions, https://coins.ha.com, auction&#10;eBay Coins, https://ebay.com/coins, marketplace&#10;PCGS, https://pcgs.com, api"
                    className="w-full h-32 p-3 border rounded-lg resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleBulkImport}
                    disabled={!bulkData.trim() || bulkImportMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Import Sources
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Template
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalSourcesManager;
