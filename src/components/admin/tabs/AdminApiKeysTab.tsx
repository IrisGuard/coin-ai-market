
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Key, Plus, Eye, EyeOff, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockApi } from '@/lib/mockApi';
import { toast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  key_name: string;
  encrypted_value: string;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const AdminApiKeysTab = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const [newKey, setNewKey] = useState({
    key_name: '',
    key_value: '',
    description: ''
  });

  const fetchApiKeys = async () => {
    try {
      // Mock API keys data
      const mockApiKeys = [
        {
          id: '1',
          key_name: 'OPENAI_API_KEY',
          encrypted_value: btoa('sk-proj-test-key-123'),
          description: 'OpenAI API key for coin analysis',
          is_active: true,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          key_name: 'STRIPE_SECRET_KEY',
          encrypted_value: btoa('sk_test_123456789'),
          description: 'Stripe secret key for payments',
          is_active: true,
          created_by: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setApiKeys(mockApiKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKey.key_name || !newKey.key_value) {
      toast({
        title: "Error",
        description: "Key name and value are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const mockApiKey = {
        id: Date.now().toString(),
        key_name: newKey.key_name,
        encrypted_value: btoa(newKey.key_value),
        description: newKey.description || null,
        is_active: true,
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setApiKeys([...apiKeys, mockApiKey]);

      toast({
        title: "Success",
        description: "API key created successfully",
      });

      setNewKey({ key_name: '', key_value: '', description: '' });
      setShowCreateDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId ? { ...key, is_active: !currentStatus, updated_at: new Date().toISOString() } : key
      ));

      toast({
        title: "Success",
        description: `API key ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API key status",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to delete the API key "${keyName}"?`)) {
      return;
    }

    try {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyReveal = (keyId: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(keyId)) {
      newRevealed.delete(keyId);
    } else {
      newRevealed.add(keyId);
    }
    setRevealedKeys(newRevealed);
  };

  const getDecryptedValue = (encryptedValue: string) => {
    try {
      return atob(encryptedValue);
    } catch {
      return '[Invalid key]';
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Key className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">API Keys Management</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto">
              <Plus className="h-4 w-4 mr-1" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="key_name">Key Name</Label>
                <Input
                  id="key_name"
                  value={newKey.key_name}
                  onChange={(e) => setNewKey({ ...newKey, key_name: e.target.value })}
                  placeholder="e.g., OPENAI_API_KEY"
                />
              </div>
              <div>
                <Label htmlFor="key_value">Key Value</Label>
                <Input
                  id="key_value"
                  type="password"
                  value={newKey.key_value}
                  onChange={(e) => setNewKey({ ...newKey, key_value: e.target.value })}
                  placeholder="Enter the API key value"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newKey.description}
                  onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                  placeholder="Description of what this key is used for"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createApiKey} className="flex-1">
                  Create Key
                </Button>
                <Button onClick={() => setShowCreateDialog(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-8 text-center">Loading API keys...</div>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{key.key_name}</h4>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {key.description && (
                      <p className="text-sm text-gray-600 mt-1">{key.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type={revealedKeys.has(key.id) ? "text" : "password"}
                        value={revealedKeys.has(key.id) ? getDecryptedValue(key.encrypted_value) : "••••••••••••••••"}
                        readOnly
                        className="text-xs font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleKeyReveal(key.id)}
                      >
                        {revealedKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Created: {new Date(key.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={key.is_active}
                      onCheckedChange={() => toggleKeyStatus(key.id, key.is_active)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteApiKey(key.id, key.key_name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No API keys found. Create your first API key to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminApiKeysTab;
