
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CreateStoreFormProps {
  onCancel: () => void;
  onSuccess: (storeId: string) => void;
}

const CreateStoreForm: React.FC<CreateStoreFormProps> = ({ onCancel, onSuccess }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    return_policy: ''
  });

  const createStoreMutation = useMutation({
    mutationFn: async (storeData: typeof formData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          name: storeData.name,
          description: storeData.description,
          return_policy: storeData.return_policy,
          is_active: true,
          verified: false,
          rating: 0,
          total_sales: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      toast({
        title: "Store Created",
        description: `${data.name} has been created successfully!`,
      });
      onSuccess(data.id);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to create store',
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Store name is required",
        variant: "destructive",
      });
      return;
    }
    createStoreMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Store</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter store name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your store"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="return_policy">Return Policy</Label>
            <Textarea
              id="return_policy"
              value={formData.return_policy}
              onChange={(e) => handleInputChange('return_policy', e.target.value)}
              placeholder="Describe your return policy"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={createStoreMutation.isPending}
              className="flex-1"
            >
              {createStoreMutation.isPending ? 'Creating...' : 'Create Store'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateStoreForm;
