
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { toast } from 'sonner';
import { Globe } from 'lucide-react';

interface CreateStoreFormProps {
  onCancel: () => void;
  onSuccess: (storeId: string) => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'DK', name: 'Denmark' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
];

const CreateStoreForm: React.FC<CreateStoreFormProps> = ({ onCancel, onSuccess }) => {
  const { user } = useAuth();
  const { isAdminUser } = useAdminStore();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: ''
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
          address: storeData.country ? { country: storeData.country } : null,
          is_active: true,
          verified: isAdminUser // Auto-verify for admin users
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      onSuccess(data.id);
      toast.success(`Store "${data.name}" created successfully${isAdminUser ? ' and verified' : ''}!`);
    },
    onError: (error: any) => {
      toast.error(`Failed to create store: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Store name is required');
      return;
    }
    createStoreMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name *</Label>
        <Input
          id="storeName"
          placeholder="Enter store name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeDescription">Description</Label>
        <Textarea
          id="storeDescription"
          placeholder="Describe your store"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country (Optional)" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {country.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAdminUser && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ This store will be automatically verified as you are an admin user.
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={createStoreMutation.isPending}
          className="flex-1"
        >
          {createStoreMutation.isPending ? 'Creating...' : `Create ${isAdminUser ? 'Verified ' : ''}Store`}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={createStoreMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateStoreForm;
