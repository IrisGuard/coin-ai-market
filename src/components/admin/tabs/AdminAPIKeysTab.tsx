
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useApiKeys } from '@/hooks/admin/useAdminApiKeys';
import { Key, Plus, Eye, EyeOff, Edit, Trash2, Shield } from 'lucide-react';

const AdminAPIKeysTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { data: apiKeys, isLoading } = useApiKeys();

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
    if (!key) return '••••••••';
    return key.substring(0, 8) + '••••••••' + key.substring(key.length - 4);
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Recently';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
        <p>Loading API keys...</p>
      </div>
    );
  }

  const stats = {
    total_keys: apiKeys?.length || 0,
    active_keys: apiKeys?.filter(key => key.is_active)?.length || 0,
    expired_keys: 0, // Would need expiry logic
    last_used: apiKeys?.length ? getTimeAgo(apiKeys[0].updated_at) : 'Never'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Keys Management</h3>
          <p className="text-sm text-muted-foreground">Manage API keys for external integrations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add API Key
        </Button>
      </div>

      {/* API Key Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_keys}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_keys}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired_keys}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Used</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{stats.last_used}</div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys configured yet
              </div>
            ) : (
              apiKeys?.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{apiKey.key_name}</div>
                    <div className="text-sm text-muted-foreground">{apiKey.description}</div>
                    <div className="text-sm font-mono mt-1">
                      {visibleKeys.has(apiKey.id) 
                        ? apiKey.encrypted_value 
                        : maskKey(apiKey.encrypted_value)
                      }
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                        {apiKey.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        Created: {getTimeAgo(apiKey.created_at)}
                      </Badge>
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
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                      Edit
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

export default AdminAPIKeysTab;
