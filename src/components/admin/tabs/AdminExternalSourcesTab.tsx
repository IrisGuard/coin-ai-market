
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExternalPriceSources, useCreateExternalSource, useUpdateExternalSource } from '@/hooks/useEnhancedDataSources';
import { 
  Globe, 
  Plus, 
  Settings, 
  Shield, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  Edit
} from 'lucide-react';

const AdminExternalSourcesTab = () => {
  const { data: sources } = useExternalPriceSources();
  const createSource = useCreateExternalSource();
  const updateSource = useUpdateExternalSource();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);

  const [newSource, setNewSource] = useState({
    source_name: '',
    source_type: 'marketplace',
    base_url: '',
    rate_limit_per_hour: 60,
    requires_proxy: true,
    scraping_config: '{}'
  });

  const handleCreateSource = () => {
    createSource.mutate({
      ...newSource,
      scraping_config: JSON.parse(newSource.scraping_config || '{}')
    });
    setIsAddDialogOpen(false);
    setNewSource({
      source_name: '',
      source_type: 'marketplace',
      base_url: '',
      rate_limit_per_hour: 60,
      requires_proxy: true,
      scraping_config: '{}'
    });
  };

  const handleToggleSource = (sourceId: string, enabled: boolean) => {
    updateSource.mutate({
      id: sourceId,
      updates: { scraping_enabled: enabled }
    });
  };

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'marketplace': return 'bg-blue-100 text-blue-800';
      case 'auction': return 'bg-purple-100 text-purple-800';
      case 'reference': return 'bg-green-100 text-green-800';
      case 'grading_service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">External Price Sources</h2>
          <p className="text-muted-foreground">
            Manage external data sources for anonymous price scraping
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add External Price Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source_name">Source Name</Label>
                  <Input
                    id="source_name"
                    value={newSource.source_name}
                    onChange={(e) => setNewSource({...newSource, source_name: e.target.value})}
                    placeholder="e.g., eBay Sold Listings"
                  />
                </div>
                <div>
                  <Label htmlFor="source_type">Source Type</Label>
                  <Select value={newSource.source_type} onValueChange={(value) => setNewSource({...newSource, source_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="auction">Auction House</SelectItem>
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
                  value={newSource.base_url}
                  onChange={(e) => setNewSource({...newSource, base_url: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rate_limit">Rate Limit (per hour)</Label>
                  <Input
                    id="rate_limit"
                    type="number"
                    value={newSource.rate_limit_per_hour}
                    onChange={(e) => setNewSource({...newSource, rate_limit_per_hour: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={newSource.requires_proxy}
                    onCheckedChange={(checked) => setNewSource({...newSource, requires_proxy: checked})}
                  />
                  <Label>Requires VPN/Proxy</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="scraping_config">Scraping Configuration (JSON)</Label>
                <Textarea
                  id="scraping_config"
                  value={newSource.scraping_config}
                  onChange={(e) => setNewSource({...newSource, scraping_config: e.target.value})}
                  placeholder='{"search_endpoint": "/search", "selectors": {"price": ".price"}}'
                  rows={4}
                />
              </div>

              <Button onClick={handleCreateSource} className="w-full">
                Create Source
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources?.map((source) => (
          <Card key={source.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{source.source_name}</CardTitle>
                <div className="flex items-center gap-2">
                  {source.requires_proxy && (
                    <Shield className="h-4 w-4 text-blue-600" title="Uses VPN/Proxy" />
                  )}
                  <Switch
                    checked={source.scraping_enabled}
                    onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                    size="sm"
                  />
                </div>
              </div>
              <Badge className={getSourceTypeColor(source.source_type)}>
                {source.source_type.replace('_', ' ')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <Globe className="h-4 w-4 inline mr-1" />
                {source.base_url}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Reliability:</span>
                  <span className={`ml-1 ${getReliabilityColor(source.reliability_score)}`}>
                    {(source.reliability_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="font-medium">Rate Limit:</span>
                  <span className="ml-1">{source.rate_limit_per_hour}/h</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Total Scrapes:</span>
                  <span className="ml-1">{source.total_scrapes}</span>
                </div>
                <div>
                  <span className="font-medium">Failed:</span>
                  <span className="ml-1 text-red-600">{source.failed_scrapes}</span>
                </div>
              </div>

              {source.last_successful_scrape && (
                <div className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Last: {new Date(source.last_successful_scrape).toLocaleDateString()}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sources?.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No External Sources</CardTitle>
            <CardDescription className="mb-4">
              Add external price sources to start collecting coin market data
            </CardDescription>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Source
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminExternalSourcesTab;
