
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Globe, Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useExternalPriceSources, useCreateExternalSource, useUpdateExternalSource } from '@/hooks/useEnhancedDataSources';

const AdminExternalSourcesTab = () => {
  const { data: sources = [], isLoading } = useExternalPriceSources();
  const createSource = useCreateExternalSource();
  const updateSource = useUpdateExternalSource();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source_name: '',
    source_type: '',
    base_url: '',
    requires_proxy: false,
    rate_limit_per_hour: 60,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSource.mutate(formData, {
      onSuccess: () => {
        setFormData({
          source_name: '',
          source_type: '',
          base_url: '',
          requires_proxy: false,
          rate_limit_per_hour: 60,
        });
        setShowForm(false);
      },
    });
  };

  const toggleScrapingEnabled = (sourceId: string, enabled: boolean) => {
    updateSource.mutate({
      id: sourceId,
      updates: { scraping_enabled: enabled }
    });
  };

  const getSourceTypeBadge = (type: string) => {
    const colors = {
      'auction': 'bg-blue-100 text-blue-800',
      'marketplace': 'bg-green-100 text-green-800',
      'reference': 'bg-purple-100 text-purple-800',
      'grading_service': 'bg-orange-100 text-orange-800',
      'dealer': 'bg-gray-100 text-gray-800',
    };
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  const getReliabilityBadge = (score: number) => {
    if (score >= 0.9) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 0.7) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">External Price Sources</h3>
          <p className="text-sm text-muted-foreground">Manage external data sources for price aggregation</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Add New Source Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New External Source</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source_name">Source Name</Label>
                  <Input
                    id="source_name"
                    value={formData.source_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, source_name: e.target.value }))}
                    placeholder="e.g., eBay Coins"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="source_type">Source Type</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, source_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auction">Auction House</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="reference">Reference Guide</SelectItem>
                      <SelectItem value="grading_service">Grading Service</SelectItem>
                      <SelectItem value="dealer">Dealer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="base_url">Base URL</Label>
                <Input
                  id="base_url"
                  value={formData.base_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_url: e.target.value }))}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rate_limit">Rate Limit (per hour)</Label>
                  <Input
                    id="rate_limit"
                    type="number"
                    value={formData.rate_limit_per_hour}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate_limit_per_hour: parseInt(e.target.value) }))}
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    checked={formData.requires_proxy}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_proxy: checked }))}
                  />
                  <Label>Requires Proxy</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createSource.isPending}>
                  {createSource.isPending ? 'Adding...' : 'Add Source'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            External Sources ({sources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading external sources...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Reliability</TableHead>
                  <TableHead>Last Scraped</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{source.source_name}</div>
                          {source.requires_proxy && (
                            <div className="flex items-center gap-1 text-xs text-orange-600">
                              <AlertCircle className="h-3 w-3" />
                              Requires Proxy
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getSourceTypeBadge(source.source_type)}</TableCell>
                    <TableCell>
                      <a href={source.base_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {source.base_url}
                      </a>
                    </TableCell>
                    <TableCell>{getReliabilityBadge(source.reliability_score)}</TableCell>
                    <TableCell>
                      {source.last_successful_scrape 
                        ? new Date(source.last_successful_scrape).toLocaleDateString() 
                        : 'Never'}
                    </TableCell>
                    <TableCell>{source.rate_limit_per_hour}/hour</TableCell>
                    <TableCell>
                      <Switch
                        checked={source.scraping_enabled}
                        onCheckedChange={(checked) => toggleScrapingEnabled(source.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminExternalSourcesTab;
