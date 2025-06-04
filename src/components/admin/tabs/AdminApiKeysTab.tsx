
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Key, Plus, Copy, Eye, EyeOff, Database, Globe, Brain, CreditCard, Upload } from 'lucide-react';
import { useApiKeys, useCreateApiKey, useApiKeyCategories, useBulkCreateApiKeys } from '@/hooks/useAdminData';
import { toast } from '@/hooks/use-toast';

const AdminApiKeysTab = () => {
  const { data: apiKeys = [], isLoading } = useApiKeys();
  const { data: categories = [], isLoading: categoriesLoading } = useApiKeyCategories();
  const createApiKey = useCreateApiKey();
  const bulkCreateApiKeys = useBulkCreateApiKeys();
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: '',
    category_id: '',
  });

  const categoryIcons = {
    'Database': Database,
    'Authentication': Key,
    'External APIs': Globe,
    'AI Services': Brain,
    'Payment': CreditCard
  };

  const supabaseKeys = [
    {
      name: 'Supabase URL',
      value: 'https://wdgnllgbfvjgurbqhfqb.supabase.co',
      description: 'Main Supabase project URL',
      category: 'Database'
    },
    {
      name: 'Supabase Anon Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU',
      description: 'Supabase anonymous access key for client-side operations',
      category: 'Authentication'
    },
    {
      name: 'Supabase Service Role Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1Mzg2NSwiZXhwIjoyMDY0NjI5ODY1fQ.O7_DPBmNmL-YOUUnFnr0Stxaz4D64CyAfMCcf_GWuoY',
      description: 'Supabase service role key for server-side operations',
      category: 'Database'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(c => c.id === formData.category_id);
    createApiKey.mutate({
      ...formData,
      category_id: formData.category_id || null
    }, {
      onSuccess: () => {
        setFormData({ name: '', value: '', description: '', category_id: '' });
        setShowForm(false);
        toast({
          title: "API Key created successfully",
          description: `Added to ${selectedCategory?.name || 'Uncategorized'}`,
        });
      },
    });
  };

  const handleBulkImportSupabase = () => {
    const keysToImport = supabaseKeys.map(key => ({
      ...key,
      category_id: categories.find(c => c.name === key.category)?.id || null
    }));

    bulkCreateApiKeys.mutate(keysToImport, {
      onSuccess: (result) => {
        setShowBulkImport(false);
        toast({
          title: "Bulk import completed",
          description: `Successfully imported ${result.imported} keys`,
        });
      },
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'coinai_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, value: result }));
  };

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || Key;
    return <IconComponent className="h-4 w-4" />;
  };

  const groupedKeys = apiKeys.reduce((acc, key) => {
    const categoryName = categories.find(c => c.id === key.category_id)?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(key);
    return acc;
  }, {} as Record<string, typeof apiKeys>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Enhanced API Key Management</h3>
          <p className="text-sm text-muted-foreground">Manage API keys with categories and bulk operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkImport(!showBulkImport)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Supabase Keys
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Bulk Import Supabase Keys */}
      {showBulkImport && (
        <Card>
          <CardHeader>
            <CardTitle>Import Supabase Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Import the Supabase project keys automatically with proper categorization:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supabaseKeys.map((key, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(key.category)}
                      <span className="font-medium text-sm">{key.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{key.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {key.category}
                    </Badge>
                  </Card>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleBulkImportSupabase} disabled={bulkCreateApiKeys.isPending}>
                  {bulkCreateApiKeys.isPending ? 'Importing...' : 'Import All Keys'}
                </Button>
                <Button variant="outline" onClick={() => setShowBulkImport(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New API Key Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., OpenAI API Key"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category.name)}
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="value">API Key Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Enter the API key value"
                    type="password"
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateRandomKey}>
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this API key is used for"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createApiKey.isPending}>
                  {createApiKey.isPending ? 'Creating...' : 'Create API Key'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categorized API Keys Display */}
      {Object.entries(groupedKeys).map(([categoryName, keys]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(categoryName)}
              {categoryName} ({keys.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div className="font-medium">{key.key_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={key.description || 'N/A'}>
                        {key.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded max-w-[200px] truncate">
                          {visibleKeys.has(key.id) 
                            ? key.encrypted_value 
                            : '••••••••••••••••'
                          }
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(key.encrypted_value)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {key.created_at ? new Date(key.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {(isLoading || categoriesLoading) && (
        <div className="text-center py-8">Loading API keys...</div>
      )}
    </div>
  );
};

export default AdminApiKeysTab;
