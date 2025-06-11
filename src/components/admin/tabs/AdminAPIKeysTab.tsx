
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit,
  Shield,
  Database,
  Zap,
  Globe
} from 'lucide-react';

const AdminAPIKeysTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [formData, setFormData] = useState({
    key_name: '',
    encrypted_value: '',
    description: '',
    category_id: ''
  });

  // Mock API keys data
  const mockApiKeys = [
    {
      id: '1',
      key_name: 'OpenAI GPT-4 API',
      description: 'AI recognition and analysis services',
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      category: 'AI Services',
      last_used: '2024-06-11T05:20:00Z',
      usage_count: 1247
    },
    {
      id: '2',
      key_name: 'Google Vision API',
      description: 'Image recognition and OCR services',
      is_active: true,
      created_at: '2024-01-20T14:15:00Z',
      category: 'AI Services',
      last_used: '2024-06-11T04:45:00Z',
      usage_count: 856
    },
    {
      id: '3',
      key_name: 'AWS S3 Storage',
      description: 'Image and file storage service',
      is_active: true,
      created_at: '2024-02-01T09:00:00Z',
      category: 'Storage',
      last_used: '2024-06-11T05:25:00Z',
      usage_count: 2134
    },
    {
      id: '4',
      key_name: 'Stripe Payment API',
      description: 'Payment processing service',
      is_active: true,
      created_at: '2024-02-10T11:30:00Z',
      category: 'Payments',
      last_used: '2024-06-10T18:20:00Z',
      usage_count: 432
    },
    {
      id: '5',
      key_name: 'SendGrid Email API',
      description: 'Email notification service',
      is_active: true,
      created_at: '2024-02-15T16:45:00Z',
      category: 'Communications',
      last_used: '2024-06-11T03:15:00Z',
      usage_count: 789
    },
    {
      id: '6',
      key_name: 'Legacy CoinGecko API',
      description: 'Cryptocurrency market data (deprecated)',
      is_active: false,
      created_at: '2024-01-01T00:00:00Z',
      category: 'External Data',
      last_used: '2024-05-15T12:00:00Z',
      usage_count: 156
    }
  ];

  const mockCategories = [
    { id: '1', name: 'AI Services', icon: '🤖' },
    { id: '2', name: 'Storage', icon: '💾' },
    { id: '3', name: 'Payments', icon: '💳' },
    { id: '4', name: 'Communications', icon: '📧' },
    { id: '5', name: 'External Data', icon: '🌐' }
  ];

  const apiKeyStats = {
    total_keys: mockApiKeys.length,
    active_keys: mockApiKeys.filter(k => k.is_active).length,
    total_usage_24h: 3421,
    categories_count: mockCategories.length
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Services': return <Zap className="h-4 w-4" />;
      case 'Storage': return <Database className="h-4 w-4" />;
      case 'Payments': return <Shield className="h-4 w-4" />;
      case 'Communications': return <Globe className="h-4 w-4" />;
      case 'External Data': return <Globe className="h-4 w-4" />;
      default: return <Key className="h-4 w-4" />;
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
          <h3 className="text-lg font-semibold">API Key Management</h3>
          <p className="text-sm text-muted-foreground">Manage external service API keys and integrations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowBulkImport(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* API Key Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeyStats.total_keys}</div>
            <p className="text-xs text-muted-foreground">registered keys</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeyStats.active_keys}</div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage (24h)</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeyStats.total_usage_24h.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">API calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeyStats.categories_count}</div>
            <p className="text-xs text-muted-foreground">service types</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Key Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add New API Key</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="key_name">Key Name</Label>
                  <Input
                    id="key_name"
                    value={formData.key_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, key_name: e.target.value }))}
                    placeholder="Enter key name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Category</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="encrypted_value">API Key Value</Label>
                <Input
                  id="encrypted_value"
                  type="password"
                  value={formData.encrypted_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, encrypted_value: e.target.value }))}
                  placeholder="Enter API key"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add API Key
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockApiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getCategoryIcon(key.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{key.key_name}</span>
                      <Badge variant={key.is_active ? 'default' : 'secondary'}>
                        {key.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{key.category}</Badge>
                    </div>
                    {key.description && (
                      <p className="text-sm text-muted-foreground mt-1">{key.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1 flex gap-4">
                      <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                      <span>Last used: {getTimeAgo(key.last_used)}</span>
                      <span>Usage: {key.usage_count} calls</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
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

export default AdminAPIKeysTab;
