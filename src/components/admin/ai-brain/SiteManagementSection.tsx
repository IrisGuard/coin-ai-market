
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Globe, Plus, Edit, Trash2, Settings, ExternalLink } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ExternalSource {
  id: string;
  source_name: string;
  base_url: string;
  source_type: string;
  is_active: boolean;
  priority_score: number;
  rate_limit_per_hour: number;
  reliability_score: number;
  specializes_in_errors: boolean;
  scraping_enabled: boolean;
  created_at: string;
}

const SiteManagementSection = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ExternalSource | null>(null);
  const [formData, setFormData] = useState({
    source_name: '',
    base_url: '',
    source_type: 'auction_site',
    priority_score: 50,
    rate_limit_per_hour: 60,
    reliability_score: 0.8,
    specializes_in_errors: false,
    scraping_enabled: true
  });

  const { data: sources = [], isLoading } = useQuery({
    queryKey: ['external-price-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('priority_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const addSourceMutation = useMutation({
    mutationFn: async (sourceData: typeof formData) => {
      const { error } = await supabase
        .from('external_price_sources')
        .insert([{
          ...sourceData,
          is_active: true
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-price-sources'] });
      toast.success('Site added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to add site: ${error.message}`);
    }
  });

  const updateSourceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ExternalSource> }) => {
      const { error } = await supabase
        .from('external_price_sources')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-price-sources'] });
      toast.success('Site updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update site: ${error.message}`);
    }
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('external_price_sources')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external-price-sources'] });
      toast.success('Site deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete site: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      source_name: '',
      base_url: '',
      source_type: 'auction_site',
      priority_score: 50,
      rate_limit_per_hour: 60,
      reliability_score: 0.8,
      specializes_in_errors: false,
      scraping_enabled: true
    });
    setEditingSource(null);
  };

  const handleSubmit = () => {
    if (editingSource) {
      updateSourceMutation.mutate({ id: editingSource.id, data: formData });
      setEditingSource(null);
    } else {
      addSourceMutation.mutate(formData);
    }
  };

  const toggleActive = (source: ExternalSource) => {
    updateSourceMutation.mutate({
      id: source.id,
      data: { is_active: !source.is_active }
    });
  };

  const openEditDialog = (source: ExternalSource) => {
    setFormData({
      source_name: source.source_name,
      base_url: source.base_url,
      source_type: source.source_type,
      priority_score: source.priority_score,
      rate_limit_per_hour: source.rate_limit_per_hour,
      reliability_score: source.reliability_score,
      specializes_in_errors: source.specializes_in_errors,
      scraping_enabled: source.scraping_enabled
    });
    setEditingSource(source);
  };

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'auction_site': return 'bg-blue-100 text-blue-800';
      case 'marketplace': return 'bg-green-100 text-green-800';
      case 'dealer_site': return 'bg-purple-100 text-purple-800';
      case 'price_guide': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Site Management</h3>
          <Badge variant="outline">{sources.length} sources</Badge>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingSource} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSource ? 'Edit Site' : 'Add New Site'}
              </DialogTitle>
              <DialogDescription>
                Configure a new external site for coin price data and scraping
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source_name">Site Name</Label>
                <Input
                  id="source_name"
                  value={formData.source_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_name: e.target.value }))}
                  placeholder="e.g., eBay, Heritage Auctions"
                />
              </div>
              
              <div>
                <Label htmlFor="base_url">Base URL</Label>
                <Input
                  id="base_url"
                  value={formData.base_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="source_type">Source Type</Label>
                <select
                  id="source_type"
                  value={formData.source_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, source_type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="auction_site">Auction Site</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="dealer_site">Dealer Site</option>
                  <option value="price_guide">Price Guide</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="priority_score">Priority Score (1-100)</Label>
                <Input
                  id="priority_score"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.priority_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority_score: parseInt(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="rate_limit">Rate Limit (per hour)</Label>
                <Input
                  id="rate_limit"
                  type="number"
                  min="1"
                  value={formData.rate_limit_per_hour}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate_limit_per_hour: parseInt(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="reliability">Reliability Score (0-1)</Label>
                <Input
                  id="reliability"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.reliability_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, reliability_score: parseFloat(e.target.value) }))}
                />
              </div>
              
              <div className="col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="specializes_in_errors"
                    checked={formData.specializes_in_errors}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, specializes_in_errors: checked }))}
                  />
                  <Label htmlFor="specializes_in_errors">Specializes in Error Coins</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scraping_enabled"
                    checked={formData.scraping_enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, scraping_enabled: checked }))}
                  />
                  <Label htmlFor="scraping_enabled">Enable Scraping</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.source_name || !formData.base_url}
              >
                {editingSource ? 'Update' : 'Add'} Site
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading sites...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <Card key={source.id} className={`${source.is_active ? '' : 'opacity-60'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{source.source_name}</CardTitle>
                    <Badge className={getSourceTypeColor(source.source_type)} size="sm">
                      {source.source_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={() => toggleActive(source)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a 
                      href={source.base_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {source.base_url}
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Priority: {source.priority_score}</div>
                    <div>Rate: {source.rate_limit_per_hour}/h</div>
                    <div>Reliability: {(source.reliability_score * 100).toFixed(0)}%</div>
                    <div>{source.specializes_in_errors ? '🎯 Errors' : '📊 General'}</div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(source)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Site</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{source.source_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteSourceMutation.mutate(source.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteManagementSection;
