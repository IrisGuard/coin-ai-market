
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Store, Edit, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Store {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

interface StoreManagerProps {
  onStoreSelect: (storeId: string) => void;
  selectedStoreId?: string;
}

const StoreManager: React.FC<StoreManagerProps> = ({ onStoreSelect, selectedStoreId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    address: ''
  });

  // Fetch user's stores
  const { data: stores, isLoading } = useQuery({
    queryKey: ['user-stores', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: async (storeData: typeof newStore) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('stores')
        .insert({
          user_id: user.id,
          name: storeData.name,
          description: storeData.description,
          address: storeData.address,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-stores'] });
      setShowCreateForm(false);
      setNewStore({ name: '', description: '', address: '' });
      onStoreSelect(data.id);
      toast({
        title: "Store Created",
        description: `${data.name} has been created successfully!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to create store',
        variant: "destructive",
      });
    },
  });

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name.trim()) {
      toast({
        title: "Error",
        description: "Store name is required",
        variant: "destructive",
      });
      return;
    }
    createStoreMutation.mutate(newStore);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading stores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          My Stores ({stores?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stores && stores.length > 0 ? (
          <div className="grid gap-3">
            {stores.map((store: Store) => (
              <div
                key={store.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedStoreId === store.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onStoreSelect(store.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    {store.description && (
                      <p className="text-sm text-gray-600">{store.description}</p>
                    )}
                    {store.address && (
                      <p className="text-xs text-gray-500 mt-1">{store.address}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={store.is_active ? "default" : "secondary"}>
                      {store.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No stores yet. Create your first store to start selling coins!</p>
          </div>
        )}

        {showCreateForm ? (
          <form onSubmit={handleCreateStore} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold">Create New Store</h3>
            <Input
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Textarea
              placeholder="Store Description"
              value={newStore.description}
              onChange={(e) => setNewStore(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              placeholder="Store Address"
              value={newStore.address}
              onChange={(e) => setNewStore(prev => ({ ...prev, address: e.target.value }))}
            />
            <div className="flex gap-2">
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
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Store
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreManager;
