
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Key, Plus, Eye, EyeOff, Trash2, RotateCcw, Search } from 'lucide-react';

const AdminAPIKeysTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyDescription, setNewKeyDescription] = useState('');
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Get API Keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`key_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Create API Key
  const createApiKey = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('secure-admin-operations', {
        body: {
          operation: 'create_api_key',
          payload: {
            name: newKeyName,
            value: newKeyValue,
            description: newKeyDescription
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setNewKeyName('');
      setNewKeyValue('');
      setNewKeyDescription('');
      setShowNewKeyDialog(false);
      toast({
        title: "API Key Created",
        description: "New API key has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle API Key Status
  const toggleKeyStatus = useMutation({
    mutationFn: async ({ keyId, isActive }: { keyId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', keyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key Updated",
        description: "API key status has been updated.",
      });
    },
  });

  // Delete API Key
  const deleteApiKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key Deleted",
        description: "API key has been deleted successfully.",
      });
    },
  });

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '***';
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Keys Management</h3>
          <p className="text-sm text-muted-foreground">Manage API keys for external services and integrations</p>
        </div>
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Key Name</label>
                <Input
                  placeholder="e.g., OpenAI API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">API Key Value</label>
                <Input
                  type="password"
                  placeholder="Enter the API key value"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of this API key"
                  value={newKeyDescription}
                  onChange={(e) => setNewKeyDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => createApiKey.mutate()}
                  disabled={!newKeyName || !newKeyValue || createApiKey.isPending}
                  className="flex-1"
                >
                  {createApiKey.isPending ? 'Creating...' : 'Create API Key'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search API keys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Active API Keys ({apiKeys?.filter(key => key.is_active).length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading API keys...</p>
              </div>
            ) : apiKeys?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys found
              </div>
            ) : (
              apiKeys?.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{apiKey.key_name}</div>
                    <div className="text-sm text-muted-foreground">{apiKey.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                        {apiKey.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <div className="text-xs text-muted-foreground font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.encrypted_value : maskKey(apiKey.encrypted_value)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleKeyStatus.mutate({ keyId: apiKey.id, isActive: apiKey.is_active })}
                      disabled={toggleKeyStatus.isPending}
                    >
                      {apiKey.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteApiKey.mutate(apiKey.id)}
                      disabled={deleteApiKey.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
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

export default AdminAPIKeysTab;
