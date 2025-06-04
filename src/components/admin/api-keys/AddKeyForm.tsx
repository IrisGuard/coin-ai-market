
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Key, Globe, Brain, CreditCard } from 'lucide-react';
import { useCreateApiKey } from '@/hooks/useAdminData';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface AddKeyFormProps {
  categories: Category[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const AddKeyForm: React.FC<AddKeyFormProps> = ({
  categories,
  showForm,
  setShowForm
}) => {
  const createApiKey = useCreateApiKey();
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

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || Key;
    return <IconComponent className="h-4 w-4" />;
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'coinai_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, value: result }));
  };

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

  if (!showForm) return null;

  return (
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
  );
};

export default AddKeyForm;
