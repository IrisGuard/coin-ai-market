
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { useCreateApiKey } from '@/hooks/useAdminData';

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

const AddKeyForm = ({ categories, showForm, setShowForm }: AddKeyFormProps) => {
  const [formData, setFormData] = useState({
    key_name: '',
    encrypted_value: '',
    description: '',
    category_id: ''
  });

  const createApiKey = useCreateApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createApiKey.mutateAsync(formData);
    setFormData({ key_name: '', encrypted_value: '', description: '', category_id: '' });
    setShowForm(false);
  };

  if (!showForm) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add New API Key</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                {categories.map((category) => (
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
            <Button type="submit" disabled={createApiKey.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              {createApiKey.isPending ? 'Adding...' : 'Add API Key'}
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
